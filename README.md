# Straw Hat Office (v4.3.4, the version live on straw-hat-office.pages.dev)

Vanilla HTML + CSS + JavaScript, no framework and no npm dependencies.
`build.py` (Python 3) joins `src/[0-9]_*` in order and inlines the art (`art/v4`) and fonts into one self-contained `index.html`.

## Run locally
1. Install Python 3.10+ (Node 18+ only for the tests).
2. `pip install pillow` (only needed by some tools/tests; the wheels in `src/` are offline copies).
3. `python3 build.py`  -> rebuilds `index.html`
4. `python3 -m http.server 8080` and open http://localhost:8080
Live crew data comes from `/crew.json` (Cloudflare Pages + KV, see `DEPLOY.md` and `DATA_FEED.md`); offline it falls back to the embedded `snapshot.json`.

## Key files
- `src/1_head.html`, `src/2_body.html`: markup + CSS
- `src/3_*.js` data and feeds, `src/4_*.js` ship/UI/voices, `src/5_*.js` systems, `src/6_*.js` main loop + version layers, `src/7_boot.js` start-up
- `art/`, `fonts/`: in-house assets; `snapshot.json`, `src/status.json`: embedded data
- `sync_crew.py`: Crew Board sheet -> KV sync; `deploy_cf.py`: Cloudflare Pages deploy
- `tests/`: checks (node / python)
- `wip/`: unfinished Deals and partner Money tab work (patches against this commit + new files)
