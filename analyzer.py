"""Local offline evidence analyzer. No uploads leave this computer."""
import json, math, re, struct
from email.parser import BytesParser
from email.policy import default
from collections import Counter, defaultdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

LIMIT=30*1024*1024

def entropy(s):
    if not s:return 0
    counts=Counter(s.lower());return -sum((n/len(s))*math.log2(n/len(s)) for n in counts.values())

def classify(rows, kind):
    suspicious=[]; reasons=Counter(); domains=Counter(); ips=Counter(); samples=[]
    for row in rows:
        q=row.get('query','').rstrip('.').lower(); ip=row.get('src_ip','unknown'); label=q.split('.')[0]
        if q: domains[q]+=1
        ips[ip]+=1
        why=[]
        if len(label)>=18 and entropy(label)>=3.35:why.append('Long high-entropy DNS label')
        if len(label)>=45:why.append('Very long DNS subdomain')
        if row.get('label')=='suspicious':why.append('Source log marks this record suspicious (unverified label)')
        if why:
            suspicious.append(row)
            reasons.update(why)
            if len(samples)<30:samples.append({'source_ip':ip,'query':q,'timestamp':row.get('timestamp',''),'reasons':why})
    total=len(rows); flagged=len(suspicious)
    ratio=round(flagged/total*100,2) if total else 0
    return {'format':kind,'total_records':total,'suspicious_records':flagged,'suspicious_percentage':ratio,'attack_type':'Possible DNS tunneling / exfiltration' if flagged else 'No DNS tunneling indicators detected','risk_level':'High' if ratio>=15 else 'Medium' if flagged else 'Low','confidence':None,'confidence_note':'No calibrated ML model. Suspicious percentage is a fraction of records, not attack probability.','indicators':dict(reasons),'top_source_ips':ips.most_common(10),'top_domains':domains.most_common(10),'samples':samples,'limitations':'Heuristic triage only. Review full packet contents, DNS responses, baselines, and endpoints before concluding exfiltration.'}

def parse_log(data):
    rows=[]
    for raw in data.decode('utf-8','replace').splitlines():
        if not raw.strip():continue
        fields=dict(re.findall(r'([a-z_]+)=([^\s]+)',raw))
        if fields.get('protocol','').upper()=='DNS' and 'query' in fields:rows.append(fields)
    return rows

def dns_name(data, offset):
    labels=[]; visited=set(); jumps=0
    while offset<len(data) and jumps<80:
        if offset in visited:break
        visited.add(offset);length=data[offset]
        if length==0:break
        if length&0xc0==0xc0:
            if offset+1>=len(data):break
            offset=((length&0x3f)<<8)|data[offset+1];jumps+=1;continue
        if length>63 or offset+1+length>len(data):break
        labels.append(data[offset+1:offset+1+length].decode('ascii','replace'));offset+=length+1;jumps+=1
    return '.'.join(labels)

def parse_pcap(data):
    if len(data)<24:raise ValueError('Truncated PCAP')
    magic=data[:4]
    if magic in (b'\xd4\xc3\xb2\xa1',b'\x4d\x3c\xb2\xa1'):endian='<'
    elif magic in (b'\xa1\xb2\xc3\xd4',b'\xa1\xb2\x3c\x4d'):endian='>'
    else:raise ValueError('Unsupported capture format: use classic .pcap, not .pcapng')
    link=struct.unpack_from(endian+'I',data,20)[0]
    if link not in (1,228):raise ValueError('Only Ethernet and raw IPv4 PCAP link types are supported')
    pos=24;rows=[];packets=0
    while pos+16<=len(data):
        sec,usec,size,original=struct.unpack_from(endian+'IIII',data,pos);pos+=16
        if size>LIMIT or pos+size>len(data):break
        frame=data[pos:pos+size];pos+=size;packets+=1
        if link==1:
            if len(frame)<34:continue
            typ=struct.unpack_from('!H',frame,12)[0];off=14
            if typ==0x8100 and len(frame)>=18:typ=struct.unpack_from('!H',frame,16)[0];off=18
            if typ!=0x0800:continue
            ip=frame[off:]
        else:ip=frame
        if len(ip)<20 or ip[0]>>4!=4:continue
        ihl=(ip[0]&15)*4
        if len(ip)<ihl+8 or ip[9]!=17:continue
        fragment=struct.unpack_from('!H',ip,6)[0]
        if fragment&0x1fff:continue
        udp=ip[ihl:];sport,dport,length=struct.unpack_from('!HHH',udp)
        if sport!=53 and dport!=53:continue
        payload=udp[8:]
        if len(payload)<13:continue
        flags=struct.unpack_from('!H',payload,2)[0]
        if flags&0x8000:continue
        name=dns_name(payload,12)
        if name:rows.append({'query':name,'src_ip':'.'.join(map(str,ip[12:16])),'timestamp':str(sec)})
    return rows,packets

class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204);self.cors();self.end_headers()
    def cors(self):
        self.send_header('Access-Control-Allow-Origin','http://localhost:5173');self.send_header('Access-Control-Allow-Methods','POST, OPTIONS');self.send_header('Access-Control-Allow-Headers','Content-Type')
    def reply(self,status,body):
        raw=json.dumps(body).encode();self.send_response(status);self.cors();self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_POST(self):
        if self.path!='/analyze':return self.reply(404,{'error':'Not found'})
        length=int(self.headers.get('Content-Length','0'))
        if length>LIMIT+4096:return self.reply(413,{'error':'File too large (30 MB max)'})
        try:
            header=self.headers.get('Content-Type','')
            if not header.startswith('multipart/form-data'):raise ValueError('Expected multipart upload')
            message=BytesParser(policy=default).parsebytes(('Content-Type: '+header+'\r\nMIME-Version: 1.0\r\n\r\n').encode()+self.rfile.read(length))
            item=next((p for p in message.iter_parts() if p.get_param('name',header='content-disposition')=='file'),None)
            if item is None:raise ValueError('No file supplied')
            name=Path(item.get_filename() or '').name.lower();data=item.get_payload(decode=True)
            if len(data)>LIMIT:raise ValueError('File exceeds 30 MB')
            if name.endswith('.pcap'):
                rows,packets=parse_pcap(data);result=classify(rows,'PCAP');result['total_packets']=packets
            elif name.endswith(('.log','.txt')):
                rows=parse_log(data);result=classify(rows,'DNS key=value log')
                if not rows:result['limitations']='This log format is not supported. Expected timestamp=... src_ip=... protocol=DNS query=...'
            else:raise ValueError('Supported formats: .pcap, .log, .txt')
            result['filename']=name;self.reply(200,result)
        except (ValueError,KeyError) as e:self.reply(400,{'error':str(e)})
        except Exception as e:self.reply(500,{'error':'Could not parse file: '+str(e)})

if __name__=='__main__':
    print('Local analyzer at http://127.0.0.1:8765');ThreadingHTTPServer(('127.0.0.1',8765),Handler).serve_forever()
