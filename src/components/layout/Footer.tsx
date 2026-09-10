import { Link } from 'react-router'
import {
  Radio,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'

import { NAV_LINKS, SITE } from '@/config'
import { useData } from '@/store/DataContext'

export default function Footer() {
  const { categories } = useData()
  const year = new Date().getFullYear()

  /*
   * Navigation publique uniquement.
   * Le lien /admin est volontairement exclu du footer.
   */
  const publicNavLinks = NAV_LINKS.filter(
    (link) => link.path !== '/admin'
  )

  const socialLinks = [
    {
      icon: Facebook,
      href: SITE.social.facebook,
      label: 'Facebook',
    },
    {
      icon: Twitter,
      href: SITE.social.twitter,
      label: 'X',
    },
    {
      icon: Instagram,
      href: SITE.social.instagram,
      label: 'Instagram',
    },
    {
      icon: Youtube,
      href: SITE.social.youtube,
      label: 'YouTube',
    },
  ]

  return (
    <footer className="bg-neutral-950 text-neutral-300">

      {/* ============================================
          FOOTER PRINCIPAL
      ============================================ */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* ========================================
              MARQUE
          ======================================== */}
          <div className="lg:pr-6">
            <Link
              to="/"
              aria-label="Radio Télévision Douvanjou - Accueil"
              className="group inline-flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D21034] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              {/* Logo icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#D21034] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Radio
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              {/* Logo text */}
              <div className="leading-none">
                <div className="font-editorial text-[15px] font-black tracking-tight text-white sm:text-[17px]">
                  RADIO TÉLÉVISION
                </div>

                <div className="mt-1 font-editorial text-lg font-black tracking-tight text-white">
                  DOUVANJOU
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.32em] text-[#5B7FE8]">
                  Haïti
                </div>
              </div>
            </Link>

            {/* Description */}
            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-400">
              {SITE.description}
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(
                ({ icon: Icon, href, label }) => {
                  if (!href) return null

                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        `Suivre Radio Télévision Douvanjou sur ${label}`
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all duration-200 hover:border-[#D21034] hover:bg-[#D21034] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D21034] focus:ring-offset-2 focus:ring-offset-neutral-950"
                    >
                      <Icon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </a>
                  )
                }
              )}
            </div>
          </div>

          {/* ========================================
              NAVIGATION
          ======================================== */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Navigation
            </h2>

            <ul className="mt-5 space-y-3">
              {publicNavLinks.slice(1).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================
              RUBRIQUES
          ======================================== */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Rubriques
            </h2>

            <ul className="mt-5 space-y-3">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/actualites?cat=${encodeURIComponent(
                      category.slug
                    )}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================
              CONTACT
          ======================================== */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h2>

            <ul className="mt-5 space-y-4 text-sm">

              {/* Adresse */}
              {SITE.address && (
                <li className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D21034]"
                    aria-hidden="true"
                  />

                  <span className="leading-5 text-neutral-400">
                    {SITE.address}
                  </span>
                </li>
              )}

              {/* Téléphone */}
              {SITE.phone && (
                <li>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="flex items-center gap-3 text-neutral-400 transition-colors hover:text-white"
                  >
                    <Phone
                      className="h-4 w-4 shrink-0 text-[#D21034]"
                      aria-hidden="true"
                    />

                    <span>{SITE.phone}</span>
                  </a>
                </li>
              )}

              {/* Email */}
              {SITE.email && (
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="flex items-center gap-3 text-neutral-400 transition-colors hover:text-white"
                  >
                    <Mail
                      className="h-4 w-4 shrink-0 text-[#D21034]"
                      aria-hidden="true"
                    />

                    <span className="break-all">
                      {SITE.email}
                    </span>
                  </a>
                </li>
              )}
            </ul>

            {/* ======================================
                RADIO EN DIRECT
            ====================================== */}
            <Link
              to="/radio"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#D21034] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#b00d2b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D21034] focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              <span
                className="rdm-live-dot h-2 w-2 rounded-full bg-white"
                aria-hidden="true"
              />

              <span>Écouter en direct</span>

              <ArrowUpRight
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================
          BARRE INFÉRIEURE
      ============================================ */}
      <div className="border-t border-neutral-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs sm:flex-row sm:px-6 lg:px-8">

          {/* Copyright */}
          <p className="text-neutral-500">
            © {year}{' '}
            <span className="text-neutral-400">
              {SITE.name}
            </span>
            . Tous droits réservés.
          </p>

          {/* Liens légaux */}
          <nav
            aria-label="Informations légales"
            className="flex items-center gap-5"
          >
            <Link
              to="/mentions-legales"
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Mentions légales
            </Link>

            <Link
              to="/confidentialite"
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
