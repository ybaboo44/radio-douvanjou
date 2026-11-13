import {
  CalendarDays,
  Clock,
  Mic2,
  Play,
  User,
} from 'lucide-react'

import { useData } from '@/store/useData'
import { formatDate } from '@/data'

export default function Emissions() {
  const { shows } = useData()

  return (
    <main className="min-h-screen bg-white">

      {/* =====================================================
          HERO / TITRE DE PAGE
          ===================================================== */}

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">

          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 bg-[#D21034]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Radio Télévision Douvanjou
            </span>
          </div>

          <h1 className="mt-4 font-editorial text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl md:text-6xl">
            Émissions
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
            Retrouvez les émissions de Radio Télévision Douvanjou :
            information, débats, culture, société, sport et musique.
          </p>

        </div>
      </section>

      {/* =====================================================
          GRILLE DES ÉMISSIONS
          ===================================================== */}

      <section className="bg-neutral-50">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">

          {/* TITRE */}

          <div className="mb-8 flex items-end justify-between border-b border-neutral-200 pb-5">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D21034]">
                Programmes
              </p>

              <h2 className="mt-1 font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
                Nos émissions
              </h2>
            </div>

            <span className="hidden text-xs font-medium text-neutral-500 sm:block">
              {shows.length} émissions
            </span>

          </div>

          {/* =================================================
              GRILLE
              ================================================= */}

          {shows.length === 0 ? (

            <div className="border border-neutral-200 bg-white px-6 py-16 text-center">

              <Mic2 className="mx-auto h-10 w-10 text-neutral-300" />

              <h3 className="mt-4 text-lg font-bold text-neutral-900">
                Aucune émission disponible
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Les émissions seront bientôt disponibles.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {shows.map((show) => (

                <article
                  key={show.id}
                  className="group overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* =========================================
                      IMAGE
                      ========================================= */}

                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">

                    <img
                      src={show.image}
                      alt={show.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Catégorie */}

                    <div className="absolute left-4 top-4">

                      <span className="bg-[#D21034] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                        {show.category}
                      </span>

                    </div>

                    {/* Nombre épisodes */}

                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-semibold text-white">

                      <Mic2 className="h-4 w-4" />

                      <span>
                        {show.episodes.length} épisodes
                      </span>

                    </div>

                  </div>

                  {/* =========================================
                      CONTENU
                      ========================================= */}

                  <div className="p-5">

                    {/* Nom */}

                    <h3 className="font-editorial text-2xl font-black leading-tight tracking-tight text-neutral-950 transition-colors group-hover:text-[#D21034]">
                      {show.name}
                    </h3>

                    {/* Description */}

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                      {show.description}
                    </p>

                    {/* =======================================
                        INFORMATIONS
                        ======================================= */}

                    <div className="mt-5 space-y-3 border-t border-neutral-100 pt-4">

                      {/* Animateur */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-neutral-100">
                          <User className="h-4 w-4 text-[#D21034]" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                            Présentateur
                          </p>

                          <p className="truncate text-xs font-bold text-neutral-900">
                            {show.host}
                          </p>

                        </div>

                      </div>

                      {/* Horaire */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-neutral-100">
                          <CalendarDays className="h-4 w-4 text-[#D21034]" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                            Diffusion
                          </p>

                          <p className="truncate text-xs font-bold text-neutral-900">
                            {show.schedule}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* =======================================
                        DERNIER ÉPISODE
                        ======================================= */}

                    {show.episodes.length > 0 && (

                      <div className="mt-5 border-t border-neutral-100 pt-4">

                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                          Dernier épisode
                        </p>

                        <div className="mt-3 flex items-center gap-3">

                          <button
                            type="button"
                            aria-label={`Écouter ${show.episodes[0].title}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-[#D21034]"
                          >
                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                          </button>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-xs font-bold text-neutral-900">
                              {show.episodes[0].title}
                            </p>

                            <div className="mt-1 flex items-center gap-3 text-[10px] text-neutral-500">

                              <span>
                                {formatDate(show.episodes[0].date)}
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {show.episodes[0].duration}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* =======================================
                        FOOTER
                        ======================================= */}

                    <div className="mt-5 border-t border-neutral-100 pt-4">

                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600 transition hover:text-[#D21034]"
                      >

                        <span>
                          Voir tous les épisodes
                        </span>

                        <span className="text-lg leading-none">
                          →
                        </span>

                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          BANDEAU RADIO
          ===================================================== */}

      <section className="bg-neutral-950 text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Radio Télévision Douvanjou
            </p>

            <h2 className="mt-2 font-editorial text-2xl font-black md:text-3xl">
              Écoutez Radio Télévision Douvanjou en direct
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Retrouvez vos émissions et toute l'actualité en direct.
            </p>

          </div>

          <a
            href="/radio"
            className="inline-flex w-fit items-center gap-2 bg-[#D21034] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#b00d2b]"
          >
            <Mic2 className="h-4 w-4" />
            Écouter en direct
          </a>

        </div>

      </section>

    </main>
  )
}