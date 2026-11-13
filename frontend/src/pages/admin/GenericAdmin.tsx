import { useState } from 'react'
import { Pencil, PlusCircle, Trash2, X } from 'lucide-react'
import { useData } from '@/store/useData'

type StoreKey = 'categories' | 'authors' | 'shows' | 'videos' | 'podcasts' | 'events'

interface Field {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'date' | 'color'
  placeholder?: string
}

interface Column {
  key: string
  label: string
}

export default function GenericAdmin({
  title,
  description,
  storeKey,
  columns,
  fields,
  titleKey,
}: {
  title: string
  description: string
  storeKey: StoreKey
  columns: Column[]
  fields: Field[]
  titleKey: string
}) {
  const data = useData()
  const items = data[storeKey] as unknown as Record<string, string>[]
  const [editing, setEditing] = useState<Record<string, string> | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const openNew = () => {
    const blank: Record<string, string> = { id: `${storeKey}-${Date.now()}` }
    fields.forEach((f) => (blank[f.key] = ''))
    setEditing(blank)
  }

  const save = () => {
    if (!editing) return
    // Valeurs par défaut pour les champs non exposés au formulaire
    const item = { ...editing }
    if (storeKey === 'authors' && !item.avatar) item.avatar = `https://picsum.photos/seed/${item.id}/200/200`
    if (storeKey === 'shows' && !item.image) item.image = `https://picsum.photos/seed/${item.id}/800/800`
    if (storeKey === 'shows' && !item.episodes) (item as Record<string, unknown>).episodes = []
    if (storeKey === 'videos' && !item.thumbnail) item.thumbnail = `https://picsum.photos/seed/${item.id}/1000/563`
    if (storeKey === 'videos' && !item.url) item.url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    if (storeKey === 'videos' && !item.source) item.source = 'hosted'
    if (storeKey === 'videos' && !item.views) (item as Record<string, unknown>).views = 0
    if (storeKey === 'podcasts' && !item.cover) item.cover = `https://picsum.photos/seed/${item.id}/600/600`
    if (storeKey === 'podcasts' && !item.audioUrl)
      item.audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    if (storeKey === 'events' && !item.image) item.image = `https://picsum.photos/seed/${item.id}/1000/700`
    data.saveItem(storeKey, item as never)
    setEditing(null)
  }

  const inputCls =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-2 focus:ring-[#D21034]/20'

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">{title}</h1>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b00d2b]"
        >
          <PlusCircle className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Formulaire */}
      {editing && (
        <div className="mt-5 rounded-xl border border-[#D21034]/30 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-editorial text-lg font-black">
              {items.some((i) => i.id === editing.id) ? 'Modifier' : 'Nouveau'} — {title}
            </h2>
            <button onClick={() => setEditing(null)} className="text-neutral-400 hover:text-neutral-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-500">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    className={inputCls}
                    rows={3}
                    value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    type={f.type ?? 'text'}
                    className={inputCls}
                    value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white">
              Enregistrer
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-bold text-neutral-600"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50">
                {columns.map((c, i) => (
                  <td key={c.key} className={i === 0 ? 'px-4 py-3 font-semibold text-neutral-900' : 'px-4 py-3 text-neutral-600'}>
                    {c.key === 'color' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded" style={{ backgroundColor: item[c.key] }} />
                        {item[c.key]}
                      </span>
                    ) : (
                      <span className="line-clamp-1 max-w-64">{String(item[c.key] ?? '—')}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing({ ...item })}
                      title="Modifier"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {confirmDelete === item.id ? (
                      <span className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            data.deleteItem(storeKey, item.id)
                            setConfirmDelete(null)
                          }}
                          className="rounded-lg bg-[#D21034] px-2 py-1.5 text-[10px] font-bold text-white"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-lg bg-neutral-200 px-2 py-1.5 text-[10px] font-bold text-neutral-700"
                        >
                          Annuler
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        title="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-[#D21034] transition hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-neutral-500">
                  Aucun élément. Cliquez sur « Ajouter » pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-400">
        {items.length} élément{items.length > 1 ? 's' : ''} · identifiant principal : {titleKey}
      </p>
    </div>
  )
}
