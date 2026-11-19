import { get, set } from 'idb-keyval'

export type Place = { id: string; name: string }
/** A "that's mine" pin. x and y are 0..1 across the layer photo. */
export type Claim = { id: string; x: number; y: number; owner: string }
/**
 * One kiln layer and the rack shelf it was unloaded onto. `photo` is the layer
 * seen from above in the kiln; `shelfPhoto` is the shelf afterwards, label in view.
 */
export type Layer = {
  id: string
  photo: string
  shelfId: string | null
  shelfPhoto?: string
  claims: Claim[]
}
export type FiringType = 'bisque' | 'glaze'
export type Firing = {
  id: string
  kilnId: string
  type: FiringType
  at: number
  done: boolean
  layers: Layer[]
}
export type State = { me: string; kilns: Place[]; shelves: Place[]; firings: Firing[] }

const KEY = 'pot-tracker-state'
export const LABEL_PREFIX = 'potshelf:'

export const uid = () => Math.random().toString(36).slice(2, 10)

export async function load(): Promise<State> {
  try {
    return (await get<State>(KEY)) ?? sample()
  } catch {
    return sample()
  }
}

export function save(state: State) {
  set(KEY, state).catch(() => {})
}

export const empty = (): State => ({ me: '', kilns: [], shelves: [], firings: [] })

// ---- Sample data, so the app can be tried before any real photos exist ----

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/** Draws a pretend top-down photo of a round kiln shelf full of pots. */
function layerPicture(seed: number, type: FiringType): string {
  const r = rng(seed)
  const bisque = ['#e6bfa6', '#dfb296', '#ecc9b3', '#d9a98c']
  const glaze = ['#3f6f8f', '#7a9e7e', '#e9e3d3', '#2f3e46', '#c98b3c', '#8c3b2e', '#a7c4bc']
  const colours = type === 'bisque' ? bisque : glaze
  let pots = ''
  for (let gy = 0; gy < 4; gy++) {
    for (let gx = 0; gx < 4; gx++) {
      const cx = 190 + gx * 140 + (r() - 0.5) * 50
      const cy = 190 + gy * 140 + (r() - 0.5) * 50
      if (Math.hypot(cx - 400, cy - 400) > 300 || r() < 0.12) continue
      const rad = 38 + r() * 26
      const c = colours[Math.floor(r() * colours.length)]
      pots +=
        `<circle cx="${cx + 5}" cy="${cy + 7}" r="${rad}" fill="#000" opacity=".18"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${c}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${rad * 0.78}" fill="#000" opacity=".16"/>` +
        `<circle cx="${cx - rad * 0.25}" cy="${cy - rad * 0.3}" r="${rad * 0.18}" fill="#fff" opacity=".25"/>`
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">` +
    `<rect width="800" height="800" fill="#6f665d"/>` +
    `<circle cx="400" cy="400" r="380" fill="#8a8178"/>` +
    `<circle cx="400" cy="400" r="345" fill="#d8d0c4"/>${pots}</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export function sample(): State {
  const hour = 3600_000
  const now = Date.now()
  const kilns = [
    { id: 'k1', name: 'Kiln 1' },
    { id: 'k2', name: 'Kiln 2' },
  ]
  const shelves = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].map((n) => ({ id: 's' + n, name: 'Rack ' + n }))
  const layer = (seed: number, type: FiringType, shelfId: string, claims: Claim[] = []): Layer => ({
    id: uid(),
    photo: layerPicture(seed, type),
    shelfId,
    claims,
  })
  return {
    me: '',
    kilns,
    shelves,
    firings: [
      {
        id: uid(),
        kilnId: 'k2',
        type: 'glaze',
        at: now - 3 * hour,
        done: true,
        layers: [
          layer(11, 'glaze', 'sB1', [{ id: uid(), x: 0.42, y: 0.4, owner: 'Ana' }]),
          layer(12, 'glaze', 'sB2'),
        ],
      },
      {
        id: uid(),
        kilnId: 'k1',
        type: 'bisque',
        at: now - 27 * hour,
        done: true,
        layers: [layer(21, 'bisque', 'sA1'), layer(22, 'bisque', 'sA2'), layer(23, 'bisque', 'sA3')],
      },
    ],
  }
}
