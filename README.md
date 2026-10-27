# Digital Evidence Analyzer — React Frontend

A responsive, English-language investigation dashboard inspired by the supplied graduation project presentation.

## Start

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

For a production build:

```bash
npm run build
npm run preview
```

## Included screens

- Overview dashboard with interactive charts and KPIs
- Cases: create, search, filter, inspect, export CSV
- Evidence: register selected files, calculate SHA-256 in the browser, inspect metadata, export CSV
- Findings: sample explainable findings and details
- Timeline: chronological event view and case filter
- Relationships: illustrative graph
- Reports: printable summary (browser Print > Save as PDF), CSV exports
- Settings: reset demo data

## Important boundaries

This is **frontend-only**. Sample cases, findings and events are synthetic. Case and evidence metadata are stored in browser localStorage. Uploaded file bytes are read locally to compute SHA-256 but are **not persisted**, parsed, sent to a server or securely stored. This is not chain-of-custody preservation or a forensic-grade tool. The detection engine, authentication, backend APIs, PostgreSQL, audit trail, role-based access control, PDF generation service and real event correlation require subsequent implementation. Do not upload sensitive real-world evidence.

## Planned integration

React frontend → ASP.NET Core Web API → PostgreSQL and Python analysis worker. Implement authenticated case/evidence APIs, streaming evidence upload with immutable server storage, verification, audit logs, parsing, normalized events, detection and correlation, then bind pages to those APIs.

## Local Traffic Analysis (new)
Run the React UI with `npm run dev`. In **another terminal** in this project folder, run `py -3 analyzer.py` (or double-click `RUN_ANALYZER_WINDOWS.bat`). Python 3 is required; the analyzer uses the standard library only. Go to **Traffic Analysis**, select a `.pcap` or DNS key=value `.log`, and click **Analyze Evidence**. It is a real local heuristic parser, not an ML probability or a forensic determination. Only classic Ethernet or raw IPv4/UDP DNS PCAP is supported; no PCAPNG or arbitrary log formats yet. Files are sent only to your local `127.0.0.1:8765` process. For production, add authentication, access control, sandboxing and stronger validation.

This uploaded ZIP was the **original demo frontend**, without the later Landing/Login/Register update. This package extends the uploaded version and does not claim to preserve authentication pages that were absent from it. The AY/DA avatar in this original project cannot truly log out because no account/session implementation exists here.
