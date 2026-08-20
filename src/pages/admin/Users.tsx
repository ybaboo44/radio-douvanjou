'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Shield,
  Lock,
  UserX,
  UserCheck,
  Search,
} from 'lucide-react'
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

type UserForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
  status: User['status']
}

const EMPTY_FORM: UserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'EDITOR',
  status: 'ACTIVE',
}

export default function AdminUsers() {
  const { can, user } = useAuth()

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  const [form, setForm] = useState<UserForm>({
    ...EMPTY_FORM,
  })

  useEffect(() => {
    void fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        )
      }

      const data: unknown = await response.json()

      if (Array.isArray(data)) {
        setUsers(data as User[])
      } else if (
        typeof data === 'object' &&
        data !== null &&
        'users' in data &&
        Array.isArray(
          (data as { users: unknown }).users
        )
      ) {
        setUsers(
          (data as { users: User[] }).users
        )
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des utilisateurs :',
        error
      )

      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (submitting) return

    try {
      setSubmitting(true)

      const url = editing
        ? `/api/admin/users/${editing.id}`
        : '/api/admin/users'

      const method = editing ? 'PUT' : 'POST'

      const body = editing
        ? {
            ...form,
            password:
              form.password.trim() || undefined,
          }
        : {
            ...form,
            password: form.password.trim(),
          }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        let message = 'Une erreur est survenue.'

        try {
          const errorData: unknown =
            await response.json()

          if (
            typeof errorData === 'object' &&
            errorData !== null &&
            'error' in errorData &&
            typeof (errorData as { error: unknown })
              .error === 'string'
          ) {
            message = (
              errorData as { error: string }
            ).error
          }
        } catch {
          // Réponse non JSON
        }

        alert(message)
        return
      }

      setShowForm(false)
      setEditing(null)
      setForm({ ...EMPTY_FORM })

      await fetchUsers()
    } catch (error) {
      console.error(
        'Erreur lors de la sauvegarde :',
        error
      )

      alert(
        'Impossible de sauvegarder cet utilisateur.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStatus(u: User) {
    if (u.id === user?.id) {
      alert(
        'Vous ne pouvez pas désactiver votre propre compte.'
      )
      return
    }

    const action =
      u.status === 'ACTIVE'
        ? 'Désactiver'
        : 'Activer'

    if (
      !confirm(
        `${action} le compte de ${u.firstName} ${u.lastName} ?`
      )
    ) {
      return
    }

    const newStatus: User['status'] =
      u.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE'

    try {
      const response = await fetch(
        `/api/admin/users/${u.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      if (!response.ok) {
        let message =
          'Impossible de modifier le statut.'

        try {
          const data: unknown =
            await response.json()

          if (
            typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: unknown })
              .error === 'string'
          ) {
            message = (
              data as { error: string }
            ).error
          }
        } catch {
          // Réponse non JSON
        }

        alert(message)
        return
      }

      await fetchUsers()
    } catch (error) {
      console.error(
        'Erreur lors du changement de statut :',
        error
      )

      alert(
        'Impossible de modifier le statut du compte.'
      )
    }
  }

  async function resetPassword(u: User) {
    if (
      !confirm(
        `Réinitialiser le mot de passe de ${u.firstName} ${u.lastName} ?`
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/users/${u.id}/reset-password`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        let message =
          'Impossible de réinitialiser le mot de passe.'

        try {
          const data: unknown =
            await response.json()

          if (
            typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: unknown })
              .error === 'string'
          ) {
            message = (
              data as { error: string }
            ).error
          }
        } catch {
          // Réponse non JSON
        }

        alert(message)
        return
      }

      alert(
        'Mot de passe réinitialisé. Un email a été envoyé.'
      )
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation :',
        error
      )

      alert(
        'Impossible de réinitialiser le mot de passe.'
      )
    }
  }

  async function deleteUser(u: User) {
    if (!isSuperAdmin) return

    if (u.id === user?.id) {
      alert(
        'Vous ne pouvez pas supprimer votre propre compte.'
      )
      return
    }

    if (
      !confirm(
        `Supprimer définitivement ${u.firstName} ${u.lastName} ?\n\nCette action est irréversible.`
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/users/${u.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        let message =
          'Impossible de supprimer cet utilisateur.'

        try {
          const data: unknown =
            await response.json()

          if (
            typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: unknown })
              .error === 'string'
          ) {
            message = (
              data as { error: string }
            ).error
          }
        } catch {
          // Réponse non JSON
        }

        alert(message)
        return
      }

      await fetchUsers()
    } catch (error) {
      console.error(
        'Erreur lors de la suppression :',
        error
      )

      alert(
        'Impossible de supprimer cet utilisateur.'
      )
    }
  }

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setShowForm(true)
  }

  function openEdit(u: User) {
    setEditing(u)

    setForm({
      firstName: u.firstName ?? '',
      lastName: u.lastName ?? '',
      email: u.email ?? '',
      password: '',
      role: u.role,
      status: u.status,
    })

    setShowForm(true)
  }

  function closeForm() {
    if (submitting) return

    setShowForm(false)
    setEditing(null)
    setForm({ ...EMPTY_FORM })
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((u) =>
      [
        u.firstName,
        u.lastName,
        u.email,
        ROLE_LABELS[u.role],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [users, search])

  if (!can('users:read')) {
    return (
      <div className="py-20 text-center text-red-600">
        Accès interdit.
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
            Utilisateurs
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Gestion des comptes et des rôles.
          </p>
        </div>

        {can('users:create') && (
          <button
            type="button"
            onClick={openNew}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b00d2b] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={submitting}
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvel utilisateur
          </button>
        )}
      </div>

      {/* Recherche */}
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2">
        <Search
          className="h-4 w-4 shrink-0 text-neutral-400"
          aria-hidden="true"
        />

        <input
          type="search"
          placeholder="Rechercher un utilisateur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          aria-label="Rechercher un utilisateur"
        />
      </div>

      {/* Tableau */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">
                Nom
              </th>

              <th className="px-4 py-3">
                E-mail
              </th>

              <th className="px-4 py-3">
                Rôle
              </th>

              <th className="px-4 py-3">
                Statut
              </th>

              <th className="px-4 py-3">
                Création
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  Chargement des utilisateurs…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  {search
                    ? 'Aucun utilisateur ne correspond à votre recherche.'
                    : 'Aucun utilisateur trouvé.'}
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="transition hover:bg-neutral-50"
                >
                  <td className="px-4 py-3 font-semibold text-neutral-900">
                    {u.firstName} {u.lastName}
                  </td>

                  <td className="px-4 py-3 text-neutral-600">
                    {u.email}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                        ROLE_COLORS[u.role] ??
                          'bg-neutral-100 text-neutral-600'
                      )}
                    >
                      <Shield
                        className="h-3 w-3"
                        aria-hidden="true"
                      />

                      {ROLE_LABELS[u.role] ??
                        u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                        u.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-200 text-neutral-600'
                      )}
                    >
                      {u.status === 'ACTIVE'
                        ? 'Actif'
                        : 'Inactif'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {u.createdAt
                      ? new Date(
                          u.createdAt
                        ).toLocaleDateString(
                          'fr-FR'
                        )
                      : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {can('users:update') && (
                        <button
                          type="button"
                          onClick={() =>
                            openEdit(u)
                          }
                          className="rounded p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-[#00209F]"
                          title="Modifier"
                          aria-label={`Modifier ${u.firstName} ${u.lastName}`}
                        >
                          <Pencil
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </button>
                      )}

                      {can('users:update') &&
                        u.id !== user?.id && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(u)
                            }
                            className="rounded p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-amber-600"
                            title={
                              u.status ===
                              'ACTIVE'
                                ? 'Désactiver'
                                : 'Activer'
                            }
                            aria-label={
                              u.status ===
                              'ACTIVE'
                                ? `Désactiver ${u.firstName} ${u.lastName}`
                                : `Activer ${u.firstName} ${u.lastName}`
                            }
                          >
                            {u.status ===
                            'ACTIVE' ? (
                              <UserX
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <UserCheck
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        )}

                      {can('users:update') && (
                        <button
                          type="button"
                          onClick={() =>
                            resetPassword(u)
                          }
                          className="rounded p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-purple-600"
                          title="Réinitialiser le mot de passe"
                          aria-label={`Réinitialiser le mot de passe de ${u.firstName} ${u.lastName}`}
                        >
                          <Lock
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </button>
                      )}

                      {isSuperAdmin &&
                        u.id !== user?.id && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteUser(u)
                            }
                            className="rounded p-1.5 text-neutral-500 transition hover:bg-red-50 hover:text-[#D21034]"
                            title="Supprimer"
                            aria-label={`Supprimer ${u.firstName} ${u.lastName}`}
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-form-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2
              id="user-form-title"
              className="font-editorial text-lg font-black text-neutral-950"
            >
              {editing ? 'Modifier' : 'Créer'} un
              utilisateur
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-3"
            >
              {/* Prénom / Nom */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1 block text-xs font-bold uppercase text-neutral-500"
                  >
                    Prénom
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        firstName:
                          e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-1 focus:ring-[#D21034]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1 block text-xs font-bold uppercase text-neutral-500"
                  >
                    Nom
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        lastName:
                          e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-1 focus:ring-[#D21034]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-bold uppercase text-neutral-500"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-1 focus:ring-[#D21034]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-xs font-bold uppercase text-neutral-500"
                >
                  Mot de passe{' '}
                  {editing && (
                    <span className="font-normal normal-case text-neutral-400">
                      (laisser vide pour ne
                      pas changer)
                    </span>
                  )}
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    editing
                      ? 'new-password'
                      : 'new-password'
                  }
                  required={!editing}
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      password:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-1 focus:ring-[#D21034]"
                />

                {!editing && (
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Minimum 8 caractères.
                  </p>
                )}
              </div>

              {/* Rôle / Statut */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="role"
                    className="mb-1 block text-xs font-bold uppercase text-neutral-500"
                  >
                    Rôle
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        role: e.target
                          .value as UserRole,
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-1 focus:ring-[#D21034]"
                  >
                    {(
                      Object.entries(
                        ROLE_LABELS
                      ) as [
                        UserRole,
                        string
                      ][]
                    ).map(
                      ([key, label]) => (
                        <option
                          key={key}
                          value={key}
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-1 block text-xs font-bold uppercase text-neutral-500"
                  >
                    Statut
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        status:
                          e.target
                            .value as User['status'],
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition focus:border-[#D21034] focus:ring-1 focus:ring-[#D21034]"
                  >
                    <option value="ACTIVE">
                      Actif
                    </option>

                    <option value="INACTIVE">
                      Inactif
                    </option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b00d2b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? 'Enregistrement…'
                    : editing
                      ? 'Enregistrer'
                      : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}