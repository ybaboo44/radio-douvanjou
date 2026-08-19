import { Link } from 'react-router'
import { Radio, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { NAV_LINKS, SITE } from '@/config'
import { useData } from '@/store/DataContext'

export default function Footer() {
  const { categories } = useData()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D21034] text-white">
                <Radio className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="font-editorial text-lg font-black tracking-tight text-white">RADIO DOUVANJOU</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#5B7FE8]">Media</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">{SITE.description}</p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Facebook, href: SITE.social.facebook, label: 'Facebook' },
                { icon: Twitter, href: SITE.social.twitter, label: 'X' },
                { icon: Instagram, href: SITE.social.instagram, label: 'Instagram' },
                { icon: Youtube, href: SITE.social.youtube, label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 transition hover:bg-[#D21034] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Sections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.slice(1).map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rubriques */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Rubriques</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/actualites?cat=${c.slug}`} className="transition hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D21034]" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#D21034]" />
                {SITE.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#D21034]" />
                {SITE.email}
              </li>
            </ul>
            <Link
              to="/radio"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D21034] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#b00d2b]"
            >
              <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-white" />
              Écouter en direct
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-neutral-500 sm:flex-row">
          <span>
            © {year} {SITE.name}. Tous droits réservés.
          </span>
          <div className="flex gap-5">
            <span className="cursor-pointer transition hover:text-neutral-300">Mentions légales</span>
            <span className="cursor-pointer transition hover:text-neutral-300">Confidentialité</span>
            <Link to="/admin" className="transition hover:text-neutral-300">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
