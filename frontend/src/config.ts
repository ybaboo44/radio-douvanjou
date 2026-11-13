// ============================================================
// CONFIGURATION GLOBALE — Radio Télévision Douvanjou
// Modifiez les URL des flux ici (radio / TV) sans toucher au code.
// ============================================================

export const SITE = {
  name: 'Radio Télévision Douvanjou',
  shortName: 'RTD',
  tagline: "L'info haïtienne, en direct et en profondeur",
  description:
    "Radio Télévision Douvanjou : actualités, radio et TV en direct, vidéos, podcasts, émissions, culture, sport et événements d'Haïti et de la diaspora.",
  email: 'contact@radiodouvanjou.com',
  phone: '+509 44 44 4444',
  address: 'Port-au-Prince, Haïti',
  social: {
    facebook: 'https://facebook.com/radiodouvanjou',
    twitter: 'https://x.com/radiodouvanjou',
    instagram: 'https://instagram.com/radiodouvanjou',
    youtube: 'https://youtube.com/@radiodouvanjou',
  },
}

// Flux en direct — remplacez par vos vraies URL de streaming.
export const STREAMS = {
  radio: {
    // Flux audio en direct (MP3/AAC/HLS)
    url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    mountName: 'Radio Télévision Douvanjou',
  },
  tv: {
    // Flux vidéo HLS (.m3u8)
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channelName: 'Douvanjou TV',
  },
}

export const NAV_LINKS = [
  { label: 'Accueil', path: '/' },
  { label: 'Actualités', path: '/actualites' },
  { label: 'Radio', path: '/radio' },
  { label: 'TV', path: '/tv' },
  { label: 'Vidéos', path: '/videos' },
  { label: 'Podcasts', path: '/podcasts' },
  { label: 'Émissions', path: '/emissions' },
  { label: 'Culture', path: '/culture' },
  { label: 'Sport', path: '/sport' },
  { label: 'Événements', path: '/evenements' },
]
