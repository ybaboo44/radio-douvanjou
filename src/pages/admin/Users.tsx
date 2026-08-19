import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Plus, Pencil, Trash2, Shield, Lock, UserX, UserCheck, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { User, UserRole } from '@/types/admin'

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrateur',
  EDITOR: 'Éditeur',
  ANIMATOR: 'Animateur',
  USER: 'Utilisateur',
}

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN: 'bg-[#00209F]/10 text-[#00209F]',
  EDITOR: 'bg-purple-100 text-purple-700',
  ANIMATOR: 'bg-amber-100 text-amber-700',
  USER: 'bg-neutral-100 text-neutral-600',
}

export default function AdminUsers() {
  const { can, isSuperAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  // Formulaire
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'EDITOR' as UserRole, status: 'ACTIVE' as const
  })

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    const r = await fetch('/api/admin/users')
    if (r.ok) setUsers(await r.json())
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = editing ? `/api/admin/users/${editing.id}` : '/api/admin/users'
    const method = editing ? 'PUT' : 'POST'
    const body = editing
      ? { ...form, password: form.password || undefined }
      : form

    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (r.ok) {
      setShowForm(false)
      setEditing(null)
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'EDITOR', status: 'ACTIVE' })
      fetchUsers()
    } else {
      const err = await r.json()
      alert(err.error || 'Erreur')
    }
  }

  async function toggleStatus(u: User) {
    if (!confirm(`${u.status === 'ACTIVE' ? 'Désactiver' : 'Activer'} ce compte ?`)) return
    await fetch(`/api/admin/users/${u.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }),
    })
    fetchUsers()
  }

  async function resetPassword(u: User) {
    if (!confirm(`Réinitialiser le mot de passe de ${u.firstName} ${u.lastName} ?`)) return
    await fetch(`/api/admin/users/${u.id}/reset-password`, { method: 'POST' })
    alert('Mot de passe réinitialisé. Un email a été envoyé.')
  }

  async function deleteUser(u: User) {
    if (!isSuperAdmin) return
    if (!confirm(`Supprimer définitivement ${u.firstName} ${u.lastName} ?`)) return
    await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    fetchUsers()
  }

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  if (!can('users:read')) {
    return <div className="py-20 text-center text-red-600">Accès interdit.</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Utilisateurs</h1>
          <p className="mt-1 text-sm text-neutral-500">Gestion des comptes et des rôles.</p>
        </div>
        {can('users:create') && (
          <button
            onClick={() => { setEditing(null); setForm({ firstName: '', lastName: '', email: '', password: '', role: 'EDITOR', status: 'ACTIVE' }); setShowForm(true) }}
            className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b00d2b]"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvel utilisateur
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Rechercher un utilisateur…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Création</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Chargement…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Aucun utilisateur trouvé.</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-semibold text-neutral-900">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={cn('flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase', ROLE_COLORS[u.role])}>
                    <Shield className="h-3 w-3" /> {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase', u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600')}>
                    {u.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {can('users:update') && (
                      <button onClick={() => { setEditing(u); setForm({ ...u, password: '' }); setShowForm(true) }} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-[#00209F]">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {can('users:update') && (
                      <button onClick={() => toggleStatus(u)} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-amber-600" title="Activer/Désactiver">
                        {u.status === 'ACTIVE' ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {can('users:update') && (
                      <button onClick={() => resetPassword(u)} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-purple-600" title="Réinitialiser le mot de passe">
                        <Lock className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {isSuperAdmin && (
                      <button onClick={() => deleteUser(u)} className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-[#D21034]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="font-editorial text-lg font-black text-neutral-950">{editing ? 'Modifier' : 'Créer'} un utilisateur</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">Prénom</label>
                  <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">Nom</label>
                  <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">E-mail</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                  Mot de passe {editing && <span className="font-normal normal-case text-neutral-400">(laisser vide pour ne pas changer)</span>}
                </label>
                <input type="password" {...(!editing && { required: true })} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">Rôle</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]">
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">Statut</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]">
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button type="submit" className="rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white hover:bg-[#b00d2b]">{editing ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}