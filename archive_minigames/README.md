# Archived mini-games (removed in v3.1, owner decision 2026-10-18)
`5_games.js` is the full v3 module (fishing, treasure diving, Usopp's cannon, card packs, break-room quiz).
It is NOT built: build.py only picks up `src/[0-9]_*`. To restore it, copy it back to src/ and re-add the
toolbar button (`<button data-act="games">MINI-GAMES</button>` in 2_body.html) and `games:openGames` in 4_ui.js.
`lion-card-art.js` holds lines 56-60 (the CARDS list and `cardArt`, incl. the 36x36 "Sunflower Lion" card:
12 petals at r11 alternating #f5961e/#ffc83a, face disc r8 #ffe39a), kept as reference for the figurehead.
