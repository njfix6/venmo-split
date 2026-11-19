import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import QRCode from 'qrcode'
import {
  LABEL_PREFIX,
  empty,
  load,
  sample,
  save,
  uid,
  type Firing,
  type FiringType,
  type Layer,
  type Place,
  type State,
} from './store'
import { readLabel, shrink } from './images'

type Tab = 'feed' | 'unload' | 'mine' | 'setup'
type Update = (fn: (s: State) => State) => void
type OpenLayer = { firingId: string; layerId: string }

const nameOf = (places: Place[], id: string | null) =>
  places.find((p) => p.id === id)?.name ?? 'Unknown'

const typeName = (t: FiringType) => (t === 'bisque' ? 'Bisque' : 'Glaze')

function when(ts: number) {
  const d = new Date(ts)
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const days = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 86400000)
  if (days === 0) return `Today, ${time}`
  if (days === 1) return `Yesterday, ${time}`
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

/** Background position that puts a point of the photo in the middle of a zoomed thumbnail. */
const ZOOM = 4.2
const centre = (v: number) => Math.min(100, Math.max(0, ((0.5 - v * ZOOM) / (1 - ZOOM)) * 100))

const mapLayer = (s: State, at: OpenLayer, fn: (l: Layer) => Layer): State => ({
  ...s,
  firings: s.firings.map((f) =>
    f.id !== at.firingId ? f : { ...f, layers: f.layers.map((l) => (l.id === at.layerId ? fn(l) : l)) },
  ),
})

export default function App() {
  const [state, setState] = useState<State | null>(null)
  const [tab, setTab] = useState<Tab>('feed')
  const [open, setOpen] = useState<OpenLayer | null>(null)
  const [labels, setLabels] = useState(false)

  useEffect(() => {
    load().then(setState)
  }, [])
  useEffect(() => {
    if (state) save(state)
  }, [state])

  if (!state) return null
  const update: Update = (fn) => setState((s) => fn(s!))

  if (labels) return <Labels shelves={state.shelves} onBack={() => setLabels(false)} />
  if (open) return <LayerView state={state} at={open} update={update} onBack={() => setOpen(null)} />

  const tabs: [Tab, string][] = [
    ['feed', 'Firings'],
    ['unload', 'Unload'],
    ['mine', 'My pots'],
    ['setup', 'Setup'],
  ]
  return (
    <div className="app">
      <main>
        {tab === 'feed' && <Feed state={state} onOpen={setOpen} />}
        {tab === 'unload' && <Unload state={state} update={update} onDone={() => setTab('feed')} />}
        {tab === 'mine' && <Mine state={state} onOpen={setOpen} />}
        {tab === 'setup' && <Setup state={state} update={update} onLabels={() => setLabels(true)} />}
      </main>
      <nav>
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ---- Firings feed: what came out of which kiln, and which shelf it went to ----

function Feed({ state, onOpen }: { state: State; onOpen: (o: OpenLayer) => void }) {
  const firings = [...state.firings].sort((a, b) => b.at - a.at)
  return (
    <>
      <h1>Firings</h1>
      {firings.length === 0 && <p className="hint">Nothing has been unloaded yet.</p>}
      {firings.map((f) => (
        <section className="card" key={f.id}>
          <h2>
            {typeName(f.type)} firing · {nameOf(state.kilns, f.kilnId)}
          </h2>
          <p className="sub">
            {when(f.at)}
            {!f.done && ' · being unloaded now'}
          </p>
          <div className="strip">
            {f.layers.map((l, i) => (
              <button className="layer" key={l.id} onClick={() => onOpen({ firingId: f.id, layerId: l.id })}>
                <img src={l.photo} alt={`Layer ${i + 1}`} />
                <span className="badge">{l.shelfId ? nameOf(state.shelves, l.shelfId) : 'No shelf yet'}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

// ---- One layer photo, full size. Tap a pot to mark it as yours. ----

function LayerView(props: { state: State; at: OpenLayer; update: Update; onBack: () => void }) {
  const { state, at, update, onBack } = props
  const firing = state.firings.find((f) => f.id === at.firingId)
  const layer = firing?.layers.find((l) => l.id === at.layerId)
  if (!firing || !layer) return null

  const claim = (e: MouseEvent<HTMLDivElement>) => {
    let me = state.me
    if (!me) {
      me = window.prompt('What is your name? It is shown on the pots you mark.')?.trim() ?? ''
      if (!me) return
    }
    const box = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - box.left) / box.width
    const y = (e.clientY - box.top) / box.height
    update((s) =>
      mapLayer({ ...s, me }, at, (l) => ({ ...l, claims: [...l.claims, { id: uid(), x, y, owner: me }] })),
    )
  }
  const unclaim = (id: string) =>
    update((s) => mapLayer(s, at, (l) => ({ ...l, claims: l.claims.filter((c) => c.id !== id) })))

  return (
    <div className="app">
      <main>
        <button className="link" onClick={onBack}>
          ‹ Back
        </button>
        <h1>{layer.shelfId ? nameOf(state.shelves, layer.shelfId) : 'No shelf yet'}</h1>
        <p className="sub">
          {typeName(firing.type)} firing · {nameOf(state.kilns, firing.kilnId)} · {when(firing.at)}
        </p>
        <div className="photo" onClick={claim}>
          <img src={layer.photo} alt="Kiln layer from above" />
          {layer.claims.map((c) => (
            <button
              key={c.id}
              className={'pin' + (c.owner === state.me ? ' mine' : '')}
              style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}
              onClick={(e) => {
                e.stopPropagation()
                if (c.owner === state.me) unclaim(c.id)
              }}
            >
              {c.owner}
            </button>
          ))}
        </div>
        <p className="hint">Tap your pot to mark it as yours. Tap your own marker to remove it.</p>
        {layer.shelfPhoto && (
          <>
            <h3>The shelf it was put on</h3>
            <img className="shelfphoto" src={layer.shelfPhoto} alt="The rack shelf after unloading" />
          </>
        )}
      </main>
    </div>
  )
}

// ---- My pots: everything this person has marked ----

function Mine({ state, onOpen }: { state: State; onOpen: (o: OpenLayer) => void }) {
  const rows = state.firings
    .flatMap((f) => f.layers.flatMap((l) => l.claims.map((c) => ({ f, l, c }))))
    .filter((r) => state.me && r.c.owner === state.me)
    .sort((a, b) => b.f.at - a.f.at)
  return (
    <>
      <h1>My pots</h1>
      {rows.length === 0 && (
        <p className="hint">Open a firing, find your pot in the photo and tap it. It will be listed here.</p>
      )}
      {rows.map(({ f, l, c }) => (
        <button className="card row" key={c.id} onClick={() => onOpen({ firingId: f.id, layerId: l.id })}>
          <span
            className="thumb"
            style={{ backgroundImage: `url("${l.photo}")`, backgroundPosition: `${centre(c.x)}% ${centre(c.y)}%` }}
          />
          <span>
            <strong>{l.shelfId ? nameOf(state.shelves, l.shelfId) : 'No shelf yet'}</strong>
            <span className="sub">
              {typeName(f.type)} fired · {when(f.at)}
            </span>
          </span>
        </button>
      ))}
    </>
  )
}

// ---- Unload: one photo per kiln layer, then the shelf it went to ----

function Unload({ state, update, onDone }: { state: State; update: Update; onDone: () => void }) {
  const active = state.firings.find((f) => !f.done)
  const [kilnId, setKilnId] = useState(state.kilns[0]?.id ?? '')
  const [type, setType] = useState<FiringType>('bisque')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  // A shelf photo whose label could not be read, kept so the shelf can be named by hand.
  const [unread, setUnread] = useState<string | null>(null)

  const mapActive = (fn: (f: Firing) => Firing) =>
    update((s) => ({ ...s, firings: s.firings.map((f) => (f.id === active?.id ? fn(f) : f)) }))

  if (!active) {
    if (state.kilns.length === 0 || state.shelves.length === 0)
      return (
        <>
          <h1>Unload a kiln</h1>
          <p className="hint">Add at least one kiln and one shelf in Setup first.</p>
        </>
      )
    const start = () =>
      update((s) => ({
        ...s,
        firings: [...s.firings, { id: uid(), kilnId, type, at: Date.now(), done: false, layers: [] }],
      }))
    return (
      <>
        <h1>Unload a kiln</h1>
        <h3>Which kiln?</h3>
        <div className="choices">
          {state.kilns.map((k) => (
            <button key={k.id} className={'chip' + (k.id === kilnId ? ' on' : '')} onClick={() => setKilnId(k.id)}>
              {k.name}
            </button>
          ))}
        </div>
        <h3>What kind of firing?</h3>
        <div className="choices">
          {(['bisque', 'glaze'] as FiringType[]).map((t) => (
            <button key={t} className={'chip' + (t === type ? ' on' : '')} onClick={() => setType(t)}>
              {typeName(t)}
            </button>
          ))}
        </div>
        <button className="btn" disabled={!kilnId} onClick={start}>
          Start unloading
        </button>
      </>
    )
  }

  const last = active.layers[active.layers.length - 1]
  const waiting = last && !last.shelfId ? last : null
  const setShelf = (shelfId: string, shelfPhoto?: string) => {
    setNote('')
    setUnread(null)
    mapActive((f) => ({
      ...f,
      layers: f.layers.map((l) => (l.id === waiting?.id ? { ...l, shelfId, shelfPhoto } : l)),
    }))
  }

  const addLayer = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const photo = await shrink(file)
      mapActive((f) => ({ ...f, layers: [...f.layers, { id: uid(), photo, shelfId: null, claims: [] }] }))
    } catch {
      setNote('That photo could not be opened. Try taking it again.')
    } finally {
      setBusy(false)
    }
  }

  const snapLabel = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const [id, shelfPhoto] = await Promise.all([readLabel(file), shrink(file)])
      if (id && state.shelves.some((s) => s.id === id)) setShelf(id, shelfPhoto)
      else {
        setUnread(shelfPhoto)
        setNote('The shelf label could not be read in that photo. Take it again with the label in view.')
      }
    } catch {
      setNote('That photo could not be opened. Try taking it again.')
    } finally {
      setBusy(false)
    }
  }

  const cancel = () => {
    if (!window.confirm('Throw away this unload and its photos?')) return
    setUnread(null)
    setNote('')
    update((s) => ({ ...s, firings: s.firings.filter((f) => f.id !== active.id) }))
  }

  return (
    <>
      <h1>
        Unloading {nameOf(state.kilns, active.kilnId)}
        <span className="sub"> · {typeName(active.type)}</span>
      </h1>

      {active.layers.length > 0 && (
        <div className="strip small">
          {active.layers.map((l) => (
            <div className="layer" key={l.id}>
              <img src={l.photo} alt="" />
              <span className="badge">{l.shelfId ? nameOf(state.shelves, l.shelfId) : '?'}</span>
            </div>
          ))}
        </div>
      )}

      {waiting ? (
        <>
          <h3>Put layer {active.layers.length} on a shelf, then photograph the shelf</h3>
          <p className="hint">Keep the shelf label in the picture. That is how the app knows which shelf it is.</p>
          <label className={'btn' + (busy ? ' busy' : '')}>
            <input type="file" accept="image/*" capture="environment" hidden onChange={snapLabel} />
            {busy ? 'Reading…' : unread ? 'Photograph the shelf again' : 'Photograph the shelf'}
          </label>
          {note && <p className="note">{note}</p>}
          {unread && (
            <details className="fallback">
              <summary>Label damaged or missing?</summary>
              <div className="choices">
                {state.shelves.map((s) => (
                  <button key={s.id} className="chip" onClick={() => setShelf(s.id, unread)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </details>
          )}
        </>
      ) : (
        <>
          <h3>
            Layer {active.layers.length + 1}
            {active.layers.length === 0 && ' (the top one)'}
          </h3>
          <label className={'btn' + (busy ? ' busy' : '')}>
            <input type="file" accept="image/*" capture="environment" hidden onChange={addLayer} />
            {busy ? 'Saving…' : 'Photograph this layer from above'}
          </label>
          {note && <p className="note">{note}</p>}
          {active.layers.length > 0 && (
            <button
              className="btn second"
              onClick={() => {
                mapActive((f) => ({ ...f, done: true }))
                onDone()
              }}
            >
              Kiln is empty — finish
            </button>
          )}
        </>
      )}
      <button className="link danger" onClick={cancel}>
        Cancel this unload
      </button>
    </>
  )
}

// ---- Setup: who you are, the studio's kilns and shelves, printable labels ----

function Setup({ state, update, onLabels }: { state: State; update: Update; onLabels: () => void }) {
  return (
    <>
      <h1>Setup</h1>
      <h3>Your name</h3>
      <input
        value={state.me}
        placeholder="Shown on the pots you mark"
        onChange={(e) => update((s) => ({ ...s, me: e.target.value }))}
      />
      <Places
        title="Kilns"
        items={state.kilns}
        placeholder="Add a kiln"
        onChange={(kilns) => update((s) => ({ ...s, kilns }))}
      />
      <Places
        title="Rack shelves"
        items={state.shelves}
        placeholder="Add a shelf"
        onChange={(shelves) => update((s) => ({ ...s, shelves }))}
      />
      <button className="btn" disabled={state.shelves.length === 0} onClick={onLabels}>
        Print shelf labels
      </button>
      <h3>Data on this phone</h3>
      <button
        className="link"
        onClick={() => window.confirm('Replace everything with sample data?') && update(() => sample())}
      >
        Load sample data
      </button>
      <button
        className="link danger"
        onClick={() => window.confirm('Delete all kilns, shelves and photos?') && update(() => empty())}
      >
        Clear everything
      </button>
    </>
  )
}

function Places(props: { title: string; items: Place[]; placeholder: string; onChange: (p: Place[]) => void }) {
  const { title, items, placeholder, onChange } = props
  const [text, setText] = useState('')
  const add = () => {
    const name = text.trim()
    if (!name) return
    onChange([...items, { id: uid(), name }])
    setText('')
  }
  return (
    <>
      <h3>{title}</h3>
      <div className="choices">
        {items.map((p) => (
          <span className="chip" key={p.id}>
            {p.name}
            <button aria-label={`Remove ${p.name}`} onClick={() => onChange(items.filter((i) => i.id !== p.id))}>
              ×
            </button>
          </span>
        ))}
      </div>
      <form
        className="add"
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
      >
        <input value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} />
        <button className="chip on">Add</button>
      </form>
    </>
  )
}

function Labels({ shelves, onBack }: { shelves: Place[]; onBack: () => void }) {
  const [codes, setCodes] = useState<Record<string, string>>({})
  useEffect(() => {
    Promise.all(
      shelves.map(async (s) => [s.id, await QRCode.toDataURL(LABEL_PREFIX + s.id, { margin: 2, width: 400 })]),
    ).then((pairs) => setCodes(Object.fromEntries(pairs)))
  }, [shelves])
  return (
    <div className="labels">
      <div className="noprint">
        <button className="link" onClick={onBack}>
          ‹ Back
        </button>
        <button className="btn" onClick={() => window.print()}>
          Print
        </button>
        <p className="hint">Stick each label on the front edge of its shelf.</p>
      </div>
      <div className="sheet">
        {shelves.map((s) => (
          <div className="label" key={s.id}>
            {codes[s.id] && <img src={codes[s.id]} alt="" />}
            <strong>{s.name}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
