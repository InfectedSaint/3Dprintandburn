"""
burn_sweep_tuner.py
Local slider + preview tool for tuning your burn sweep logo effect.

How it works:
- Writes a tuner HTML file into your Vite /public folder.
- Starts a local HTTP server in that folder.
- Opens your browser to the tuner page.
- Sliders update CSS variables live and output a CSS snippet you can paste back into App.jsx.

Usage (from your project root):
  python burn_sweep_tuner.py

If your public folder is elsewhere:
  python burn_sweep_tuner.py --public "path\to\public" --port 8000

Stop the server with Ctrl+C.
"""

import argparse
import http.server
import os
import socketserver
import sys
import webbrowser
from pathlib import Path

TUNER_FILENAME = "_burn_tuner.html"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", default="public", help="Path to your Vite public/ folder (default: public)")
    ap.add_argument("--port", type=int, default=8000, help="Port for the local server (default: 8000)")
    args = ap.parse_args()

    public_dir = Path(args.public).resolve()
    if not public_dir.exists() or not public_dir.is_dir():
        print(f"[ERROR] public folder not found: {public_dir}")
        print("Run this from your project root, or pass --public path_to_public")
        sys.exit(1)

    # If the HTML isn't already there, write it.
    tuner_path = public_dir / TUNER_FILENAME

    # Embed the HTML from this script's directory (shipped alongside)
    script_dir = Path(__file__).resolve().parent
    bundled_html = script_dir / TUNER_FILENAME
    if not bundled_html.exists():
        print(f"[ERROR] Bundled HTML not found next to script: {bundled_html}")
        sys.exit(1)

    tuner_path.write_text(bundled_html.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"[OK] Wrote tuner page: {tuner_path}")

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=str(public_dir), **kw)

        def log_message(self, fmt, *args):
            # quieter
            pass

    with socketserver.TCPServer(("127.0.0.1", args.port), Handler) as httpd:
        url = f"http://127.0.0.1:{args.port}/{TUNER_FILENAME}"
        print(f"[OK] Serving: {public_dir}")
        print(f"[OK] Open:   {url}")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[OK] Stopped.")
        finally:
            # keep the tuner file by default; user can delete it when done
            pass

if __name__ == "__main__":
    main()
