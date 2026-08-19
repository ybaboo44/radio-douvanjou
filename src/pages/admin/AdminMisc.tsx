import { useMemo, useState } from 'react'
import { Radio, Tv, CheckCircle2, RotateCcw, Shield, KeyRound } from 'lucide-react'
import { SITE, STREAMS } from '@/config'
import { useData } from '@/store/DataContext'

// ------------------------------------------------------------
// Radio / TV — configuration des flux
// ------------------------------------------------------------
export function AdminStream({ type }: { type: 'radio' | 'tv' }) {
  const isRadio = type === 'radio'
  const conf = isRadio ? STREAMS.radio : STREAMS.tv
  const name = isRadio ? (conf as typeof STREAMS.radio).mountName : (conf as typeof STREAMS.tv).channelName

  return (
    <div className="max-w-3xl">
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
        {isRadio ? 'Radio — flux en direct' : 'TV — flux en direct'}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Configuration du flux {isRadio ? 'audio' : 'vidéo HLS'} diffusé sur la page publique.
      </p>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              isRadio ? 'bg-[#D21034]/10 text-[#D21034]' : 'bg-[#00209F]/10 text-[#00209F]'
            }`}
          >
            {isRadio ? <Radio className="h-6 w-6" /> : <Tv className="h-6 w-6" />}
          </span>
          <div>
            <div className="font-bold text-neutral-950">{name}</div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Flux configuré
            </span>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">
            URL du flux {isRadio ? '(MP3 / AAC / HLS)' : '(HLS .m3u8)'}
          </label>
          <code className="block w-full overflow-x-auto rounded-lg bg-neutral-950 px-4 py-3 text-xs text-green-400">
            {conf.url}
          </code>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            Étape 1 (MVP) : l'URL est centralisée dans <code className="rounded bg-neutral-100 px-1">src/config.ts</code>{' '}
            (objet <code className="rounded bg-neutral-100 px-1">STREAMS</code>). À l'Étape 2, elle sera modifiable ici
            et stockée en base PostgreSQL via les paramètres.
          </p>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Médias — bibliothèque d'images utilisées
// ------------------------------------------------------------
export function AdminMedias() {
  const { articles, shows, videos, podcasts, events } = useData()
  const medias = useMemo(() => {
    const list: { url: string; label: string; type: string }[] = [
      ...articles.map((a) => ({ url: a.image, label: a.title, type: 'Article' })),
      ...shows.map((s) => ({ url: s.image, label: s.name, type: 'Émission' })),
      ...videos.map((v) => ({ url: v.thumbnail, label: v.title, type: 'Vidéo' })),
      ...podcasts.map((p) => ({ url: p.cover, label: p.title, type: 'Podcast' })),
      ...events.map((e) => ({ url: e.image, label: e.title, type: 'Événement' })),
    ]
    return list
  }, [articles, shows, videos, podcasts, events])

  return (
    <div>
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Médiathèque</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {medias.length} médias référencés. À l'Étape 2 : upload de fichiers protégé et stockage serveur.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {medias.map((m, i) => (
          <figure key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <img src={m.url} alt={m.label} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <figcaption className="p-3">
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-600">
                {m.type}
              </span>
              <div className="mt-1.5 line-clamp-1 text-xs font-semibold text-neutral-800">{m.label}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Utilisateurs
// ------------------------------------------------------------
const DEMO_USERS = [
  { name: 'Administrateur RDM', email: 'admin@radiodouvanjou.com', role: 'Administrateur', status: 'Actif' },
  { name: 'Jean-Pierre Baptiste', email: 'jp.baptiste@radiodouvanjou.com', role: 'Rédacteur en chef', status: 'Actif' },
  { name: 'Marie-Rose Delva', email: 'mr.delva@radiodouvanjou.com', role: 'Éditeur', status: 'Actif' },
  { name: 'Ricardo Saint-Fleur', email: 'r.saintfleur@radiodouvanjou.com', role: 'Contributeur', status: 'Actif' },
]

export function AdminUsers() {
  return (
    <div>
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Utilisateurs</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Comptes et rôles de la rédaction. L'authentification complète (login, permissions, RBAC) arrive à l'Étape 2.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {DEMO_USERS.map((u) => (
              <tr key={u.email}>
                <td className="px-4 py-3 font-semibold text-neutral-900">{u.name}</td>
                <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#00209F]/10 px-2.5 py-1 text-[10px] font-bold uppercase text-[#00209F]">
                    <Shield className="h-3 w-3" /> {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
        Sécurité prévue (Étape 2) : authentification par session, hachage des mots de passe, permissions par rôle,
        protection des routes /admin et des fichiers uploadés, secrets en variables d'environnement.
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Paramètres
// ------------------------------------------------------------
export function AdminSettings() {
  const { resetDemo } = useData()
  const [resetDone, setResetDone] = useState(false)

  const rows = [
    ['Nom du site', SITE.name],
    ['Slogan', SITE.tagline],
    ['E-mail de contact', SITE.email],
    ['Téléphone', SITE.phone],
    ['Adresse', SITE.address],
    ['Flux radio', STREAMS.radio.url],
    ['Flux TV (HLS)', STREAMS.tv.url],
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Paramètres</h1>
      <p className="mt-1 text-sm text-neutral-500">Informations générales de la plateforme.</p>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 border-b border-neutral-100 px-5 py-3.5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{k}</span>
            <span className="max-w-md truncate text-sm font-medium text-neutral-900">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-sm font-bold text-[#D21034]">Zone de maintenance</h2>
        <p className="mt-1 text-xs text-neutral-600">
          Réinitialise tous les contenus aux données de démonstration d'origine (supprime les modifications locales).
        </p>
        <button
          onClick={() => {
            resetDemo()
            setResetDone(true)
            setTimeout(() => setResetDone(false), 2500)
          }}
          className="mt-3 flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b00d2b]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {resetDone ? 'Données réinitialisées !' : 'Réinitialiser les données de démo'}
        </button>
      </div>
    </div>
  )
}
