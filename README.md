# Fourth Man

**One ball. Four fans. Four stories.**

Four fans watch the same delivery but want different explanations. Fourth Man freezes a moment from a famous T20 chase and explains it through four lenses. The ball and the score never move. Only the explanation changes.

## The flow

1. **Landing (`/`):** a 3D orbit of the four lenses reacting to the same ball, then the four lens cards.
2. **Pick a match (`/watch/<lens>`):** three famous last-over chases, each card showing the runs-needed trend.
3. **Freeze a moment (`/watch/<lens>/<match>`):** two zones only.
   - **Left:** one moment card with the moment chips, what the ball was, and the score it left. It stays pinned.
   - **Right:** the lens that explains it. Secondary detail sits behind small “+” toggles, so each lens leads with a single answer.

Each lens follows the same pattern: **one question, one visual, one answer.** That makes the four easy to tell apart.

| Lens | Asks | The visual |
| --- | --- | --- |
| **Beginner** (new to cricket) | “What just happened?” | A 3D replay of the ball, an everyday analogy, and tap-to-flip cricket words |
| **Strategist** (thinks like a captain) | “What are the options?” | A 3D hand of option cards: the one actually played is dealt to the front; tap another to swing it forward |
| **Statistician** (lives in the numbers) | “What do the numbers say?” | Required-rate gauges before → after, and three sourced numbers |
| **Fantasy Thinker** (plays Dream11) | “What did it do to my team?” | Collectible 3D player cards; switching Captain ×2 / VC ×1.5 spins them and recounts the points |

**Compare all 4** shows the four answers to the same ball side by side.

Keyboard: `←` `→` moments · `1`–`4` lenses · `C` compare · `H` Hinglish. All motion respects `prefers-reduced-motion`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # validates data, then prerenders all 20 pages as static HTML
```

## Deploy (Vercel)

Import the repo in Vercel. The defaults work as-is: framework Next.js, build command `npm run build`. There are no environment variables, APIs, database or auth.

## Data

- **`data/moments.json`:** 3 matches with 13 moments in total. Each match has the deliveries around its finish, and each moment has English and Hinglish narration for all four lenses.
  - **IND v PAK 2022** and **BAN v IND 2018** are *verified*: ball-by-ball and scorecard figures come from ESPNcricinfo.
  - **ENG v WI 2016** is *illustrative* demo data. The UI labels every match with its data type.
- **`data/scoring-rules.json`:** the official Dream11 **T20** points table, copied value-for-value with its verbatim text from `dream11.com/games/point-system`. The values were read from Wayback Machine copies of that page because the live page was down on 10 Oct 2026.
- **Fantasy points are computed, never written by hand.** Each line is a rule multiplied by a count. A missing rule shows **Unavailable**, and so does anything the rules page doesn't define, such as a dot ball on a wicket delivery.
- **`scripts/validate-data.mjs`** runs before every build. It checks that every moment's score matches a replay of the deliveries, that each batter's Run points match the runs they scored, that every rule and source exists, and that every string has both English and Hinglish.

## Structure

```
app/                      landing, /watch/[lens], /watch/[lens]/[match], 404
components/               FourthMan (moment screen), Scoreboard, MomentCard, BallStrip, LensTabs, LensPanel, CompareView, Nav
components/lenses/        one component per lens
components/viz/           FieldReplay, OptionDeck, PlayerCards (3D), Gauge, FlipCard, TiltCard, CountUp
components/landing/       PersonaOrbit, Ball3D, MiniPreview
lib/                      types, data access, cricket maths, fantasy engine, persona copy
data/                     moments.json, scoring-rules.json
scripts/                  validate-data.mjs
```
