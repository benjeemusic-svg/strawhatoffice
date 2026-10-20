# AMBIENT v4.2: the ship feels alive

This adds subtle, cozy ambient motion on top of the v4 world: the same 32-colour palette, 16 px grid, dark-brown sel-out outlines and light from the top-left (see `STYLE-GUIDE.md`).
Everything is drawn in code (`tools/v42/ambient.py`). There are no outside or paid assets.

Rebuild and preview:
```
cd tools/v42 && python3 ambient.py && python3 preview42.py
```

**Runtime files** (≈ 42 KB, budget ≤ 120 KB):

| File | Bytes | Contents |
|---|---|---|
| `ambient-v4.2.json` | ≈ 23 KB | Every sprite: sheet, w/h, frames, fps, loop, anchor, layer, recolor, placement. Also `placements`, `motion`, `layers`, `schedule` |
| `ambient/v4.2/aquarium.png` | 1.9 KB | 4 fish, bubbles, clean tank backdrops |
| `ambient/v4.2/deck.png` | 2.7 KB | Grass tufts, butterflies, leaves, 4 tree-rustle overlays |
| `ambient/v4.2/ship.png` | 7.6 KB | Flag, sail, wake, waterline roll laps |
| `ambient/v4.2/sea.png` | 3.0 KB | Shimmer + foam 64 px tiles × 4 phases |
| `ambient/v4.2/events.png` | 3.9 KB | Gull, jumping fish, dolphin, distant ship, Sea King peek, clouds × 4 phases |

All coordinates are **world px**: the 402×620 v4 world, where 1 px = 1 pt = 3 device px on iPhone 16 Pro.
`anchor` is the pixel inside a frame that is placed at the sprite's (x, y). Frames are listed left to right in `frames` as [x, y] cells of the sheet.

The `recolor` column says how a sprite follows the time of day:
- `lut`: run the frames through the v4 phase LUT once per phase change, the same as the crew (`setPhaseV4`).
- `none` + `phase`: the sprite was drawn separately for each phase. Pick the `_<phase>` variant.
- `none` on aquarium sprites: the tanks are **emissive** (lit at night). Draw them in day colours in every phase, *after* the glow layer.

## Sheets
| Sprite | Sheet | Frame | Frames | fps | Anchor | Layer | Recolor | Fixed position |
|---|---|---|---|---|---|---|---|---|
| `aq_clown` | ambient/v4.2/aquarium.png | 9×6 | 4 | 6 | 4,3 | aquarium | none |  |
| `aq_pink` | ambient/v4.2/aquarium.png | 10×5 | 4 | 6 | 5,2 | aquarium | none |  |
| `aq_tang` | ambient/v4.2/aquarium.png | 10×7 | 4 | 6 | 5,3 | aquarium | none |  |
| `aq_puff` | ambient/v4.2/aquarium.png | 8×7 | 4 | 6 | 4,3 | aquarium | none |  |
| `aq_bubble` | ambient/v4.2/aquarium.png | 3×3 | 4 | — (once) | 1,1 | aquarium | none |  |
| `aq_bubble_column` | ambient/v4.2/aquarium.png | 5×20 | 8 | 6 | 2,19 | aquarium | none |  |
| `tank_L_bg` | ambient/v4.2/aquarium.png | 98×23 | 1 | — (once) | 0,0 | aquarium | none | @76,408 |
| `tank_R_bg` | ambient/v4.2/aquarium.png | 98×23 | 1 | — (once) | 0,0 | aquarium | none | @228,408 |
| `grass_0` | ambient/v4.2/deck.png | 16×16 | 4 | 3 | 0,0 | deck | lut |  |
| `grass_1` | ambient/v4.2/deck.png | 16×16 | 4 | 3 | 0,0 | deck | lut |  |
| `butterfly_orange` | ambient/v4.2/deck.png | 9×8 | 4 | 10 | 4,4 | air | lut |  |
| `butterfly_pink` | ambient/v4.2/deck.png | 9×8 | 4 | 10 | 4,4 | air | lut |  |
| `leaf_green` | ambient/v4.2/deck.png | 6×6 | 4 | 6 | 3,3 | air | lut |  |
| `leaf_autumn` | ambient/v4.2/deck.png | 6×6 | 4 | 6 | 3,3 | air | lut |  |
| `tree0_rustle` | ambient/v4.2/deck.png | 39×39 | 3 | 6 | 0,0 | deck | lut | @89,101 |
| `tree1_rustle` | ambient/v4.2/deck.png | 39×39 | 3 | 6 | 0,0 | deck | lut | @277,101 |
| `tree2_rustle` | ambient/v4.2/deck.png | 33×33 | 3 | 6 | 0,0 | deck | lut | @134,68 |
| `tree3_rustle` | ambient/v4.2/deck.png | 33×33 | 3 | 6 | 0,0 | deck | lut | @240,68 |
| `flag` | ambient/v4.2/ship.png | 22×30 | 6 | 8 | 2,29 | ysort | lut | @216,97 |
| `sail` | ambient/v4.2/ship.png | 64×26 | 6 | 5 | 32,1 | deck | lut | @201,113 |
| `wake` | ambient/v4.2/ship.png | 168×24 | 4 | 6 | 84,0 | sea.surface | lut | @201,598 |
| `waterline_port` | ambient/v4.2/ship.png | 70×521 | 2 | — (once) | 0,0 | sea.surface | lut | @44,72 |
| `waterline_starboard` | ambient/v4.2/ship.png | 71×521 | 2 | — (once) | 0,0 | sea.surface | lut | @287,72 |
| `sea_shimmer_<phase>` | ambient/v4.2/sea.png | 64×64 | 4 | 3 | 0,0 | sea.overlay | none |  |
| `sea_foam_<phase>` | ambient/v4.2/sea.png | 64×64 | 4 | 2 | 0,0 | sea.overlay | none |  |
| `gull` | ambient/v4.2/events.png | 17×10 | 4 | 8 | 9,6 | air | lut |  |
| `gull_shadow` | ambient/v4.2/events.png | 9×3 | 1 | — (once) | 4,1 | sea.under | none |  |
| `jump_fish` | ambient/v4.2/events.png | 16×20 | 8 | 10 (once) | 8,16 | sea.surface | lut |  |
| `dolphin` | ambient/v4.2/events.png | 48×26 | 12 | 10 (once) | 24,21 | sea.surface | lut |  |
| `far_ship` | ambient/v4.2/events.png | 24×16 | 2 | 1 | 12,13 | sea.sky | lut |  |
| `seaking_peek` | ambient/v4.2/events.png | 44×40 | 14 | 6 (once) | 22,33 | sea.surface | lut |  |
| `cloud0_<phase>` | ambient/v4.2/events.png | 40×16 | 1 | — (once) | 0,0 | sea.sky | none |  |
| `cloud1_<phase>` | ambient/v4.2/events.png | 56×20 | 1 | — (once) | 0,0 | sea.sky | none |  |
| `cloud2_<phase>` | ambient/v4.2/events.png | 28×12 | 1 | — (once) | 0,0 | sea.sky | none |  |

`sea_shimmer_<phase>` / `sea_foam_<phase>` and `cloud0..2_<phase>` exist for `day`, `dusk`, `night` and `storm`.
Clouds are 40×16, 56×20 and 28×12.

### Notes per group
1. **Aquarium.** `spots.json` has no aquarium rect. The two tanks sit in the lounge's north wall, so their rects live in `ambient-v4.2.json → placements.aquarium.tanks`:
   - `tank_L` x 76, y 408, 98×23; `tank_R` x 228, y 408, 98×23.
   - Water rows are y+0..19 and the sand is y+20..22. Fish swim inside `swim` (x+2, y+2, w−4, 15).
   - Draw `tank_*_bg` first: it is the baked tank with the static fish and bubbles removed. Then draw 2 fish per tank and the bubble columns at `bubblers`, clipped to the water rows.
   - Fish face left; mirror them to swim right. The four kinds use different colours: orange clown, pink, blue tang, purple puffer.
2. **Lawn deck.**
   - `grass_0/1` are 16×16 overlay tiles. They only add blades over the baked lawn, at the 8 spots in `placements.deck.grass` ([x, y, variant]).
   - `tree<i>_rustle` are overlays at `at` for the 4 baked trees. They are only drawn during a gust; showing nothing is the "rest" frame.
   - Butterflies wander in `butterflyArea`. Leaves fall from a canopy rim.
3. **Ship.**
   - `flag` is the jolly roger on a pole at the crow's-nest rim (216, 97). It is y-sorted with the crew, so the lookout stands in front of the pole.
   - `sail` is a topsail on the main yard at (201, 113), drawn just before the crew.
   - `wake` hangs under the stern at (201, 598). Only its top 22 px fall inside the 620 px world.
   - **Bob:** `dy = (t mod 4 s) < 2 s ? 0 : 1`, applied to the layers ship, deck, ysort, front, glow and aquarium. The amplitude is 1 world px, which is 3 device px at 3×. The period is 4 s. Use integer px only.
     Water, sea overlays, sea events, wake and waterline never move, so the ship visibly rides the water.
     If the ship runs on its own canvas, a 1-device-px variant (CSS `translateY(1px)` on that canvas) is also integer-pixel safe.
   - **Roll:** the pixel art never rotates; roll shows only at the water edge.
     `waterline_port` / `waterline_starboard` are foam laps on the low side, and each has 2 frames (0 = light lap, 1 = full lap).
     Step through `motion.roll.steps` with one step every 0.75 s, so a full cycle takes **6 s**:
     port full, port light, level, starboard light, starboard full, starboard light, level, port light.
4. **Sea.**
   - Shimmer (glints) and foam (whitecaps that curl, break and fade while drifting 1 px per frame) are 64 px seamless tiles per phase.
   - Day uses white glints, dusk warm tan and orange, night sparse tealL and parch moonlight, storm dense grey and white.
   - Tile them over the v4 water tiles. Better still, pre-composite water + shimmer + foam into the 4 cached water canvases, rebuilt on a phase change.
   - Events:
     - `gull`: 4-frame flap. Frame 1 is the glide pose. Its `gull_shadow` sits on the water at +10,+22.
     - `jump_fish`: rise, arc, splash, ring.
     - `dolphin`: 12 frames: ripple, emerge, 5 arc poses, dive, splash, ring. It faces right; mirror it for right to left.
     - `far_ship`: a low-contrast navy silhouette with a 1 fps bob.
     - `seaking_peek`: a friendly, round-eyed Sea King with cheek blush. It rises, looks centre, left, blinks, looks right, smiles twice, then sinks.
       `hold` adds ticks: frame 4 + 4, frame 7 + 3, frame 8 + 3. That makes 24 ticks at 6 fps, about 4 s.

## Draw order (`ambient-v4.2.json → layers`)
1. **water**: v4 tiles. Use `deep` at night and in storms.
2. **sea.overlay**: `sea_shimmer_<phase>`, `sea_foam_<phase>`.
3. **sea.under**: v4 fish and sea-king shadows, gull shadows.
4. **sea.sky**: clouds and the distant ship. They sit on the water like reflections or low mist, so they never cover the crew.
5. **sea.surface**: jump_fish, dolphin, seaking_peek, wake, waterline laps.
6. **ship** (+bob).
7. **deck**: grass, tree rustle, sail (+bob).
8. **ysort**: crew, drop shadows and the flag, sorted by feet y (+bob).
9. **front** (+bob).
10. **glow** (+bob, at dusk, night and storm).
11. **aquarium**: backdrop, fish, bubbles. Emissive (+bob).
12. **air**: gulls, butterflies, falling leaves (no bob).

## How often (`schedule`)
| Thing | Rule |
|---|---|
| Flag | Continuous, 8 fps (night 5, storm 12) |
| Sail | Continuous, 5 fps (storm 8) |
| Wake | Continuous, 6 fps |
| Roll | Continuous, 6 s cycle |
| Bob | Continuous, 4 s cycle |
| Sea shimmer / foam | Continuous: shimmer 3 fps, foam 2 fps (storm 4) |
| Aquarium fish | Always 2 per tank, 4–10 px/s. They turn at the walls and pause 1–3 s every 6–12 s (3 fps while paused) |
| Aquarium bubbles | A column every 1.5–3 s per tank |
| Grass | Continuous 3 fps. Frame offset = (x/16) mod 4, so a slow wave crosses the lawn |
| Gusts | Every 8–15 s for 2 s: grass at 6 fps, tree rustle frames 0, 1, 2, 1 at 6 fps |
| Butterflies | Day and dusk only, 1–2. They wander at 8–14 px/s and rest 2–4 s with wings closed (frame 2) |
| Falling leaf | One every 15–30 s (storm: every 5–10 s; none at night). Falls 6 px/s with ±3 px sway, rests 3 s, disappears |
| **Gulls (rare)** | **Every 20–40 s**, 1–2 gulls crossing in 8–12 s. Never at night; in storms every 60–90 s. Flap 1 s, glide 1–2 s |
| Jumping fish | Every 25–60 s on open sea (x < 50, x > 352 or y > 600). Day, dusk and night |
| Dolphin | Every 60–120 s, day and dusk. 30 % chance of a second dolphin 0.4 s later |
| Distant ship | One every 3–6 min, crossing y 8–30 (above the bow) or y 600–614 in 120–180 s |
| Clouds | 1–3 alive, spawning every 30–60 s and drifting 3–6 px/s. Storm: 3–4 alive at 8 px/s |
| **Sea King peek** | **At most once every 5–10 min.** The cooldown is random between 300 and 600 s, and the first peek comes at least 120 s after load. Never while a dolphin is on screen. Side margins x 22–40 or 362–380, y 160–560. About 4–5 s |

Use one shared scheduler: a single `nextAt` per event kind, and **at most 2 one-shot sea events on screen at a time**.

## Phone budget (iPhone 16 Pro, 30 fps)
- **Ambient adds ≤ 3 ms per frame.** It typically issues ≈ 20–35 extra `drawImage` calls of small sprites:
  - 8 grass tufts, 4 aquarium fish + 4 bubble columns + 2 backdrops;
  - flag, sail, wake, ≤ 1 waterline lap;
  - ≤ 2 butterflies, ≤ 1 leaf, ≤ 2 gulls + 2 shadows, ≤ 3 clouds, ≤ 2 one-shots.

  Sea overlays add **no calls** if they are baked into the 4 cached water canvases. Otherwise they add 2 × 7×10 tile draws: still allowed, but cache them.
- **No per-frame allocations or recolours.** Run the phase LUT only on a phase change, inside the existing `setPhaseV4` pass. Aquarium sprites are never recoloured.
- **Positions are integers** (`Math.round`) and use `imageSmoothingEnabled = false`. Nothing rotates and there is no alpha blending: every pixel is a palette colour.
- **Pause when the tab is hidden.** On `visibilitychange`, when `document.hidden`, cancel the rAF loop. On return, reset `t0` and every `nextAt` so events don't burst to catch up.
- **Reduced motion** (`matchMedia('(prefers-reduced-motion: reduce)')`) stops everything except a static frame:
  - flag, sail, grass and fish show frame 0 at fixed spots, and there are no bubbles;
  - no bob, roll, wake animation, shimmer or foam animation (use frame 0);
  - no events, butterflies or leaves.

  Re-check the setting when it changes.
- **Memory.** The decoded sheets come to about 2.3 MB, ship.png being the largest at 672×604.
  Phase variants of the `lut` sheets are about 4 × 1.1 MB, cached only for the current and the previous phase.

## Preview (made only from the runtime files)
- `preview/v4.2/ambient-sheet@4x.png`: every sprite and frame, with its specs.
- `preview/v4.2/aquarium.gif`: lounge tanks at 4×.
- `preview/v4.2/deck.gif`: lawn deck at 3×: gust, butterflies, leaf, flag, sail.
- `preview/v4.2/sea-events.gif`: full world at 2×. It shows gulls, jumping fish, dolphins, the Sea King peek, the distant ship, clouds, wake, roll and bob on `ship_day`.
- `preview/v4.2/sea-phases.png`: the sea overlays and clouds for day, dusk, night and storm.
- `preview/v4.2/phone-v4.2@3x.png` (1206×2622) and `@1x`: the v4 phone mock with ambient on.

`tools/v42/preview42.py` is a Python reference player of this spec (timings, layers, bob/roll, LUT, clipping). Mirror it in JS.

## Not done
- No JS player has been added to `sprites.js` yet; the spec and the Python reference stand in for it. The v4 app work happens elsewhere.
- The timings are not profiled on a real iPhone. The ≤ 3 ms figure is an estimate from the draw-call count.
- Clouds sit in `sea.sky`, under the ship, by design. A true overhead cloud layer would cover the crew.
- `aq_bubble` particles and the falling leaf need small app-side motion code. Only the sprites and rules are provided.
