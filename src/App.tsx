import { Routes, Route } from 'react-router'
import { DataProvider } from '@/store/DataContext'
import { PlayerProvider } from '@/store/PlayerContext'
import { AuthProvider } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Actualites from '@/pages/Actualites'
import ArticleDetail from '@/pages/ArticleDetail'
import Radio from '@/pages/Radio'
import TV from '@/pages/TV'
import Videos from '@/pages/Videos'
import Podcasts from '@/pages/Podcasts'
import Emissions from '@/pages/Emissions'
import CategoryPage from '@/pages/CategoryPage'
import Evenements from '@/pages/Evenements'

// Admin
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminLogin from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import ArticlesAdmin from '@/pages/admin/ArticlesAdmin'
import ArticleEditor from '@/pages/admin/ArticleEditor'
import GenericAdmin from '@/pages/admin/GenericAdmin'
import { AdminStream, AdminMedias } from '@/pages/admin/AdminMisc'
import AdminUsers from '@/pages/admin/Users'
import AdminRoles from '@/pages/admin/Roles'
import AdminFeeds from '@/pages/admin/Feeds'
import AdminPodcasts from '@/pages/admin/Podcasts'
import AdminSettings from '@/pages/admin/Settings'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <PlayerProvider>
          <Routes>
            {/* ═══════════════════════════════════════
                SITE PUBLIC
            ═══════════════════════════════════════ */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:slug" element={<ArticleDetail />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/tv" element={<TV />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/emissions" element={<Emissions />} />
              <Route
                path="/culture"
                element={
                  <CategoryPage
                    categoryId="culture"
                    title="Culture"
                    description="Musique, cinéma, littérature et arts : la vie culturelle haïtienne et de la diaspora."
                    accent="#E07B00"
                  />
                }
              />
              <Route
                path="/sport"
                element={
                  <CategoryPage
                    categoryId="sport"
                    title="Sport"
                    description="Grenadiers, basket, athlétisme, boxe : toute l'actualité sportive haïtienne."
                    accent="#DC2626"
                  />
                }
              />
              <Route path="/evenements" element={<Evenements />} />
            </Route>

            {/* ═══════════════════════════════════════
                ADMINISTRATION
            ═══════════════════════════════════════ */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />

              <Route path="articles" element={<ArticlesAdmin />} />
              <Route path="articles/nouveau" element={<ArticleEditor />} />
              <Route path="articles/:id" element={<ArticleEditor />} />

              <Route
                path="categories"
                element={
                  <GenericAdmin
                    title="Catégories"
                    description="Rubriques éditoriales du site."
                    storeKey="categories"
                    titleKey="name"
                    columns={[
                      { key: 'name', label: 'Nom' },
                      { key: 'slug', label: 'Slug' },
                      { key: 'color', label: 'Couleur' },
                    ]}
                    fields={[
                      { key: 'name', label: 'Nom', placeholder: 'Politique' },
                      { key: 'slug', label: 'Slug', placeholder: 'politique' },
                      { key: 'color', label: 'Couleur', type: 'color' },
                    ]}
                  />
                }
              />

              <Route
                path="auteurs"
                element={
                  <GenericAdmin
                    title="Auteurs"
                    description="Journalistes et chroniqueurs de la rédaction."
                    storeKey="authors"
                    titleKey="name"
                    columns={[
                      { key: 'name', label: 'Nom' },
                      { key: 'role', label: 'Rôle' },
                      { key: 'bio', label: 'Bio' },
                    ]}
                    fields={[
                      { key: 'name', label: 'Nom complet' },
                      { key: 'role', label: 'Rôle', placeholder: 'Journaliste politique' },
                      { key: 'bio', label: 'Biographie', type: 'textarea' },
                    ]}
                  />
                }
              />

              <Route
                path="emissions"
                element={
                  <GenericAdmin
                    title="Émissions"
                    description="Programmes radio et TV de la grille."
                    storeKey="shows"
                    titleKey="name"
                    columns={[
                      { key: 'name', label: 'Nom' },
                      { key: 'host', label: 'Animateur' },
                      { key: 'schedule', label: 'Horaire' },
                      { key: 'category', label: 'Catégorie' },
                    ]}
                    fields={[
                      { key: 'name', label: "Nom de l'émission" },
                      { key: 'host', label: 'Animateur(s)' },
                      { key: 'schedule', label: 'Horaire', placeholder: 'Lun–Ven · 6h00 – 9h00' },
                      { key: 'category', label: 'Catégorie', placeholder: 'Information' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                    ]}
                  />
                }
              />

              <Route path="radio" element={<AdminStream type="radio" />} />
              <Route path="tv" element={<AdminStream type="tv" />} />

              <Route
                path="videos"
                element={
                  <GenericAdmin
                    title="Vidéos"
                    description="Reportages, interviews, débats et documentaires."
                    storeKey="videos"
                    titleKey="title"
                    columns={[
                      { key: 'title', label: 'Titre' },
                      { key: 'category', label: 'Catégorie' },
                      { key: 'duration', label: 'Durée' },
                      { key: 'date', label: 'Date' },
                    ]}
                    fields={[
                      { key: 'title', label: 'Titre' },
                      { key: 'category', label: 'Catégorie', placeholder: 'Reportages' },
                      { key: 'duration', label: 'Durée', placeholder: '12:48' },
                      { key: 'date', label: 'Date', type: 'date' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                    ]}
                  />
                }
              />

              <Route path="podcasts" element={<AdminPodcasts />} />
              <Route path="flux" element={<AdminFeeds />} />

              <Route
                path="evenements"
                element={
                  <GenericAdmin
                    title="Événements"
                    description="Festivals, concerts, matchs et rendez-vous."
                    storeKey="events"
                    titleKey="title"
                    columns={[
                      { key: 'title', label: 'Titre' },
                      { key: 'date', label: 'Date' },
                      { key: 'location', label: 'Lieu' },
                      { key: 'category', label: 'Catégorie' },
                    ]}
                    fields={[
                      { key: 'title', label: "Titre de l'événement" },
                      { key: 'date', label: 'Date', type: 'date' },
                      { key: 'time', label: 'Heure', placeholder: '19h00' },
                      { key: 'location', label: 'Lieu' },
                      { key: 'category', label: 'Catégorie', placeholder: 'Concert' },
                      { key: 'price', label: 'Tarif', placeholder: 'Entrée libre' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                    ]}
                  />
                }
              />

              <Route path="medias" element={<AdminMedias />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="parametres" element={<AdminSettings />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </DataProvider>
    </AuthProvider>
  )
}