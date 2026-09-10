import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, Eye, MapPin, Pause, Play, Radio as RadioIcon, Tv } from 'lucide-react'
import { useData } from '@/store/DataContext'
import { usePlayer } from '@/store/PlayerContext'
import { STREAMS } from '@/config'
import { formatDate, formatViews, getAuthor } from '@/data'
import { ArticleCard, ArticleRow, CategoryBadge, Newsletter, SectionHeader } from '@/components/shared'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export default function Home() {
  const { publishedArticles, shows, podcasts, videos, events } = useData()
  const player = usePlayer()

  const featured = publishedArticles.filter((a) => a.featured)
  const hero = featured[0] ?? publishedArticles[0]
  const sideFeatured = (featured.length > 1 ? featured.slice(1) : publishedArticles.slice(1, 3)).slice(0, 2)
  const latest = publishedArticles.filter((a) => a.id !== hero?.id).slice(0, 6)
  const mostRead = [...publishedArticles].sort((a, b) => b.views - a.views).slice(0, 5)
  const cultureArticles = publishedArticles.filter((a) => a.categoryId === 'culture').slice(0, 3)
  const sportArticles = publishedArticles.filter((a) => a.categoryId === 'sport').slice(0, 3)

  const radioPlaying = player.track?.isLive && player.playing

  return (
    <div className="min-h-full bg-[#faf9f6] pb-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#D21034]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D21034]">
              Radio Télévision Douvanjou
            </p>
            <p className="mt-1 font-editorial text-sm font-bold text-neutral-800 sm:text-base">
              La voix d’Haïti, partout dans le monde
            </p>
          </div>
        </div>
        <Link
          to="/radio"
          className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:border-[#D21034] hover:text-[#D21034] sm:flex"
        >
          <RadioIcon className="h-4 w-4 text-[#D21034]" />
          94.5 FM · En direct
        </Link>
      </div>

      {/* ===================== À LA UNE ===================== */}
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <SectionHeader title="À la une" />
        {hero && (
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.article {...fadeUp} className="group relative overflow-hidden rounded-xl lg:col-span-2">
              <Link to={`/actualites/${hero.slug}`}>
                <div className="aspect-[16/10] w-full overflow-hidden md:aspect-[16/9]">
                  <img
                    src={hero.image}
                    alt={hero.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                  <CategoryBadge categoryId={hero.categoryId} />
                  <h1 className="font-editorial mt-3 max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
                    {hero.title}
                  </h1>
                  <p className="mt-2 hidden max-w-2xl text-sm text-neutral-200 md:block">{hero.excerpt}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-300">
                    <span className="font-semibold text-white">{getAuthor(hero.authorId)?.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDate(hero.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {formatViews(hero.views)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>

            <div className="flex flex-col gap-6">
              {sideFeatured.map((a) => (
                <motion.article key={a.id} {...fadeUp} className="group relative flex-1 overflow-hidden rounded-xl">
                  <Link to={`/actualites/${a.slug}`} className="block h-full">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <CategoryBadge categoryId={a.categoryId} />
                      <h2 className="font-editorial mt-2 text-lg font-bold leading-snug text-white md:text-xl">
                        {a.title}
                      </h2>
                      <span className="mt-1 block text-xs text-neutral-300">{formatDate(a.publishedAt)}</span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===================== DERNIÈRES ACTUALITÉS ===================== */}
      <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 pt-12">
        <SectionHeader title="Dernières actualités" linkTo="/actualites" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <aside className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <h3 className="font-editorial text-lg font-black text-neutral-950">Les plus lus</h3>
            <div className="mt-2">
              {mostRead.map((a, i) => (
                <ArticleRow key={a.id} article={a} index={i} />
              ))}
            </div>
          </aside>
        </div>
      </motion.section>

      {/* ===================== RADIO LIVE ===================== */}
      <motion.section {...fadeUp} className="mt-14 bg-neutral-950 py-12 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2">
          <div>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#5B7FE8]">
              <RadioIcon className="h-4 w-4" /> Radio en direct
            </span>
            <h2 className="font-editorial mt-3 text-3xl font-black md:text-4xl">
              {STREAMS.radio.mountName}
            </h2>
            <p className="mt-3 max-w-lg text-neutral-400">
              Écoutez Radio Douvanjou partout dans le monde : information continue, grands entretiens, débats et le
              meilleur de la musique haïtienne, 24h/24.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() =>
                  player.playTrack({
                    title: STREAMS.radio.mountName,
                    subtitle: 'En ce moment : Douvanjou Matin — J.-P. Baptiste & M.-R. Delva',
                    url: STREAMS.radio.url,
                    isLive: true,
                  })
                }
                className="flex items-center gap-3 rounded-full bg-[#D21034] px-7 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:bg-[#b00d2b]"
              >
                {radioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {radioPlaying ? 'Pause' : 'Écouter le direct'}
              </button>
              <Link
                to="/radio"
                className="rounded-full border border-neutral-600 px-6 py-3.5 text-sm font-semibold transition hover:border-white"
              >
                Voir la programmation
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 rounded bg-[#D21034] px-2.5 py-1 text-xs font-black uppercase">
                <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-white" /> En direct
              </span>
              <span className="text-xs text-neutral-400">94.5 FM · Port-au-Prince</span>
            </div>
            <h3 className="font-editorial mt-4 text-2xl font-bold">Douvanjou Matin</h3>
            <p className="mt-1 text-sm text-neutral-400">Avec Jean-Pierre Baptiste & Marie-Rose Delva · 6h00 – 9h00</p>
            <div className="mt-5 border-t border-neutral-800 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Ensuite</span>
              <p className="mt-1 text-sm font-semibold">Santé & Bien-être — Dr. F. Célestin · 9h00 – 11h00</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================== TV + VIDÉOS ===================== */}
      <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 pt-14">
        <SectionHeader title="TV & Vidéos" linkTo="/videos" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Link to="/tv" className="group relative overflow-hidden rounded-xl lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden bg-neutral-900">
              <img
                src={videos[0]?.thumbnail}
                alt="Douvanjou TV en direct"
                className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D21034] text-white shadow-xl transition group-hover:scale-110">
                <Play className="ml-1 h-7 w-7" />
              </span>
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-[#D21034] px-2.5 py-1 text-xs font-black uppercase text-white">
              <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-white" /> TV en direct
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
              <div className="flex items-center gap-2 text-white">
                <Tv className="h-4 w-4" />
                <span className="font-bold">{STREAMS.tv.channelName}</span>
              </div>
              <p className="text-sm text-neutral-300">Regardez le journal télévisé et les émissions en direct</p>
            </div>
          </Link>
          <div className="flex flex-col gap-4">
            {videos.slice(1, 4).map((v) => (
              <Link key={v.id} to="/videos" className="group flex gap-3">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                  <img src={v.thumbnail} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D21034]">{v.category}</span>
                  <h4 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 group-hover:text-[#D21034]">
                    {v.title}
                  </h4>
                  <span className="text-xs text-neutral-500">{formatViews(v.views)} vues</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===================== PODCASTS ===================== */}
      <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 pt-14">
        <SectionHeader title="Podcasts" linkTo="/podcasts" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/podcasts"
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/80 px-2.5 py-1 text-xs font-bold text-white">
                  {p.duration}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00209F]">{p.show}</span>
                <h3 className="mt-1 line-clamp-2 font-bold leading-snug text-neutral-950 group-hover:text-[#D21034]">
                  {p.title}
                </h3>
                <span className="mt-2 block text-xs text-neutral-500">{formatDate(p.date)}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ===================== ÉMISSIONS ===================== */}
      <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 pt-14">
        <SectionHeader title="Nos émissions" linkTo="/emissions" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shows.slice(0, 6).map((s) => (
            <Link
              key={s.id}
              to="/emissions"
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <img src={s.image} alt={s.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7DA2FF]">{s.category}</span>
                <h3 className="font-editorial text-xl font-bold text-white">{s.name}</h3>
                <p className="mt-1 text-xs text-neutral-300">
                  {s.host} · {s.schedule}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ===================== CULTURE + SPORT ===================== */}
      <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 pt-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="Culture" linkTo="/culture" accent="#E07B00" />
            <div className="space-y-1">
              {cultureArticles[0] && <ArticleCard article={cultureArticles[0]} />}
              {cultureArticles.slice(1).map((a) => (
                <div key={a.id} className="pt-2">
                  <ArticleRow article={a} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Sport" linkTo="/sport" accent="#DC2626" />
            <div className="space-y-1">
              {sportArticles[0] && <ArticleCard article={sportArticles[0]} />}
              {sportArticles.slice(1).map((a) => (
                <div key={a.id} className="pt-2">
                  <ArticleRow article={a} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================== ÉVÉNEMENTS ===================== */}
      <motion.section {...fadeUp} className="mx-auto max-w-7xl px-4 pb-16 pt-14">
        <SectionHeader title="Événements à venir" linkTo="/evenements" accent="#00209F" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((e) => (
            <Link
              key={e.id}
              to="/evenements"
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={e.image} alt={e.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded bg-[#00209F] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  {e.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-editorial text-lg font-bold leading-snug text-neutral-950 group-hover:text-[#D21034]">
                  {e.title}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-neutral-600">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-[#D21034]" /> {formatDate(e.date)} · {e.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#D21034]" /> {e.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      <Newsletter />
    </div>
  )
}
