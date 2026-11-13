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
import { useData } from '@/store/useData'
import { useSiteSettings } from '@/store/useSiteSettings'
import { getSettingValue } from '@/store/site-settings-utils'

export default function Footer() {
  const { categories } = useData()
  const { settings } = useSiteSettings()
  const siteName = getSettingValue(settings, 'site.name') || SITE.name
  const description = getSettingValue(settings, 'site.description')
  const email = getSettingValue(settings, 'site.email')
  const phone = getSettingValue(settings, 'site.phone')
  const address = getSettingValue(settings, 'site.address')
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
      href: getSettingValue(settings, 'social.facebook'),
      label: 'Facebook',
    },
    {
      icon: Twitter,
      href: getSettingValue(settings, 'social.twitter'),
      label: 'X',
    },
    {
      icon: Instagram,
      href: getSettingValue(settings, 'social.instagram'),
      label: 'Instagram',
    },
    {
      icon: Youtube,
      href: getSettingValue(settings, 'social.youtube'),
      label: 'YouTube',
    },
  ]

  return (
    <footer className="bg-neutral-950 text-neutral-300">

      {/* ============================================
          FOOTER PRINCIPAL
      ============================================ */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-4 lg:gap-10">

          {/* ========================================
              MARQUE
          ======================================== */}
          <div className="col-span-2 min-w-0 lg:col-span-1 lg:pr-6">
            <Link
              to="/"
              aria-label={`${siteName} - Accueil`}
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
                <div className="max-w-[200px] break-words font-editorial text-base font-black tracking-tight text-white sm:text-lg">
                  {siteName}
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.32em] text-[#5B7FE8]">
                  Haïti
                </div>
              </div>
            </Link>

            {/* Description */}
            <p className="mt-5 max-w-sm break-words text-sm leading-6 text-neutral-400">
              {description}
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
          <div className="min-w-0">
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
          <div className="min-w-0">
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
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h2>

            <ul className="mt-5 space-y-4 text-sm">

              {/* Adresse */}
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D21034]"
                    aria-hidden="true"
                  />

                  <span className="min-w-0 break-words leading-5 text-neutral-400">
                    {address}
                  </span>
                </li>
              )}

              {/* Téléphone */}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-neutral-400 transition-colors hover:text-white"
                  >
                    <Phone
                      className="h-4 w-4 shrink-0 text-[#D21034]"
                      aria-hidden="true"
                    />

                    <span className="min-w-0 break-words">{phone}</span>
                  </a>
                </li>
              )}

              {/* Email */}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-neutral-400 transition-colors hover:text-white"
                  >
                    <Mail
                      className="h-4 w-4 shrink-0 text-[#D21034]"
                      aria-hidden="true"
                    />

                    <span className="break-all">
                      {email}
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
              className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#D21034] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#b00d2b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D21034] focus:ring-offset-2 focus:ring-offset-neutral-950 sm:w-auto sm:px-5"
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs sm:flex-row sm:text-left sm:px-6 lg:px-8">

          {/* Copyright */}
          <p className="text-neutral-500">
            © {year}{' '}
            <span className="text-neutral-400">
              {siteName}
            </span>
            . Tous droits réservés.
          </p>

          {/* Liens légaux */}
          <nav
            aria-label="Informations légales"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end"
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