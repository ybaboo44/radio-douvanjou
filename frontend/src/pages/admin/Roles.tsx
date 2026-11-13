import { ShieldCheck, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/admin'

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Accès complet au système. Gestion des utilisateurs, rôles, paramètres et contenus.',
  ADMIN: 'Gestion des contenus, flux, podcasts et paramètres autorisés. Pas de gestion du Super Admin.',
  EDITOR: 'Création et modification des contenus, émissions et podcasts. Pas de gestion des utilisateurs.',
  ANIMATOR: 'Gestion de ses émissions, podcasts et contenus associés.',
  USER: 'Accès limité aux fonctionnalités attribuées.',
}

const ROLE_PERMISSIONS_LIST: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['Toutes les permissions'],
  ADMIN: ['articles:*', 'categories:*', 'shows:*', 'radio:*', 'tv:*', 'videos:*', 'podcasts:*', 'feeds:*', 'events:*', 'medias:*', 'settings:read', 'settings:update'],
  EDITOR: ['articles:create', 'articles:read', 'articles:update', 'shows:create', 'shows:read', 'shows:update', 'podcasts:create', 'podcasts:read', 'podcasts:update'],
  ANIMATOR: ['shows:own', 'podcasts:own', 'medias:own'],
  USER: ['profile:read'],
}

export default function AdminRoles() {
  const { can } = useAuth()

  if (!can('users:read')) {
    return <div className="py-20 text-center text-red-600">Accès interdit.</div>
  }

  return (
    <div>
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Rôles & Permissions</h1>
      <p className="mt-1 text-sm text-neutral-500">Vue d'ensemble du système de contrôle d'accès (RBAC).</p>

      <div className="mt-6 space-y-4">
        {(Object.keys(ROLE_DESCRIPTIONS) as UserRole[]).map((role) => (
          <div key={role} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00209F]/10 text-[#00209F]">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-neutral-900">
                  {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Administrateur' : role === 'EDITOR' ? 'Éditeur' : role === 'ANIMATOR' ? 'Animateur' : 'Utilisateur'}
                </h3>
                <p className="text-xs text-neutral-500">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLE_PERMISSIONS_LIST[role].map((perm) => (
                <span key={perm} className="rounded bg-neutral-100 px-2 py-1 text-[10px] font-bold uppercase text-neutral-600">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            La modification des rôles et permissions est réservée au Super Admin.
            Pour modifier un rôle assigné à un utilisateur, rendez-vous dans la section <strong>Utilisateurs</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}