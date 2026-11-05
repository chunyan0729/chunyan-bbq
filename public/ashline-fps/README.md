# ASHLINE RAID — FPS

Fast low-poly Three.js FPS with the same loop as the 2D side-scroller: gold, shop, endless 30:00.

## Run

```bash
cd /cursor/stores/self/docs/ashline-fps
python3 -m http.server 8766
```

Open http://127.0.0.1:8766/ or `ashline-fps.html` (single-file + CDN Three.js).

## Play

- **WASD** move, **mouse** look (pointer lock), **click** fire, **Space** jump
- Start with **SIDEARM**; **1 gold / kill**; **VECTOR SMG = 10**
- Near orange **Armory**, press **F** to buy
- Endless waves ramp up; optional Titan spikes; session ends at **30:00**

## Files

- `index.html` + `style.css` + `game.js` (ES module + import map)
- `ashline-fps.html` — single-file (Three.js CDN, no modules)
