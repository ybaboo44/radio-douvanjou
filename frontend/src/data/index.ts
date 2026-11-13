// ============================================================
// DONNÉES DE DÉMONSTRATION — Radio Télévision Douvanjou (Étape 1 MVP)
// Ces données seront remplacées par PostgreSQL à l'Étape 2.
// ============================================================

export type ArticleStatus = 'publie' | 'brouillon'

export interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export interface Author {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  image: string
  categoryId: string
  authorId: string
  tags: string[]
  status: ArticleStatus
  publishedAt: string
  featured?: boolean
  breaking?: boolean
  views: number
}

export interface Show {
  id: string
  name: string
  image: string
  description: string
  host: string
  schedule: string
  category: string
  episodes: Episode[]
}

export interface Episode {
  id: string
  title: string
  date: string
  duration: string
  audioUrl?: string
}

export interface Podcast {
  id: string
  title: string
  show: string
  cover: string
  description: string
  duration: string
  date: string
  audioUrl: string
  category: string
}

export interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  date: string
  category: string
  source: 'youtube' | 'vimeo' | 'hosted'
  url: string
  views: number
  description: string
}

export interface EventItem {
  id: string
  title: string
  image: string
  date: string
  time: string
  location: string
  category: string
  description: string
  price: string
}

// ------------------------------------------------------------
// Catégories
// ------------------------------------------------------------
export const categories: Category[] = [
  { id: 'haiti', name: 'Haïti', slug: 'haiti', color: '#D21034' },
  { id: 'politique', name: 'Politique', slug: 'politique', color: '#00209F' },
  { id: 'economie', name: 'Économie', slug: 'economie', color: '#0F7B3D' },
  { id: 'societe', name: 'Société', slug: 'societe', color: '#7C3AED' },
  { id: 'culture', name: 'Culture', slug: 'culture', color: '#E07B00' },
  { id: 'education', name: 'Éducation', slug: 'education', color: '#0E7490' },
  { id: 'technologie', name: 'Technologie', slug: 'technologie', color: '#4F46E5' },
  { id: 'sport', name: 'Sport', slug: 'sport', color: '#DC2626' },
  { id: 'international', name: 'International', slug: 'international', color: '#334155' },
]

// ------------------------------------------------------------
// Auteurs
// ------------------------------------------------------------
export const authors: Author[] = [
  {
    id: 'jpb',
    name: 'Jean-Pierre Baptiste',
    role: 'Rédacteur en chef',
    avatar: 'https://picsum.photos/seed/rdm-author-jpb/200/200',
    bio: "Journaliste depuis 15 ans, Jean-Pierre couvre la politique haïtienne et les grandes questions de société.",
  },
  {
    id: 'mrd',
    name: 'Marie-Rose Delva',
    role: 'Journaliste politique',
    avatar: 'https://picsum.photos/seed/rdm-author-mrd/200/200',
    bio: "Correspondante parlementaire, Marie-Rose suit l'actualité institutionnelle et électorale.",
  },
  {
    id: 'wj',
    name: 'Widson Joseph',
    role: 'Journaliste économie',
    avatar: 'https://picsum.photos/seed/rdm-author-wj/200/200',
    bio: "Spécialiste des questions économiques, de la gourde et du commerce caribéen.",
  },
  {
    id: 'ncf',
    name: 'Nathalie C. François',
    role: 'Chroniqueuse culture',
    avatar: 'https://picsum.photos/seed/rdm-author-ncf/200/200',
    bio: "Plume de la rédaction culturelle, Nathalie raconte la scène artistique haïtienne et de la diaspora.",
  },
  {
    id: 'rs',
    name: 'Ricardo Saint-Fleur',
    role: 'Journaliste sport',
    avatar: 'https://picsum.photos/seed/rdm-author-rs/200/200',
    bio: "Football, athlétisme, boxe : Ricardo suit les Grenadiers et les athlètes haïtiens partout dans le monde.",
  },
  {
    id: 'ema',
    name: 'Ernst M. André',
    role: 'Correspondant international',
    avatar: 'https://picsum.photos/seed/rdm-author-ema/200/200',
    bio: "Basé entre Montréal et Miami, Ernst couvre la diaspora et l'actualité internationale.",
  },
]

// ------------------------------------------------------------
// Articles
// ------------------------------------------------------------
const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const articles: Article[] = [
  {
    id: 'a1',
    slug: 'port-au-prince-plan-securite-renforce',
    title: "Port-au-Prince : les autorités annoncent un plan de sécurité renforcé dans le centre-ville",
    excerpt:
      "Le gouvernement a dévoilé un dispositif conjoint police-armée visant à sécuriser les principaux axes de la capitale et à rouvrir progressivement les zones commerciales.",
    content: [
      "Le gouvernement haïtien a présenté ce jeudi un plan de sécurité renforcé pour le centre de Port-au-Prince, articulé autour d'un déploiement conjoint de la Police nationale d'Haïti et des Forces armées. L'objectif affiché : reprendre le contrôle des grands axes commerciaux et permettre la réouverture progressive des marchés et des banques du centre-ville.",
      "Selon le communiqué officiel, le dispositif prévoit des patrouilles permanentes, des points de contrôle mobiles et la réhabilitation de plusieurs sous-commissariats fermés ces derniers mois. Des unités spécialisées seront également affectées à la protection des institutions publiques et des portes d'entrée de la capitale.",
      "Les commerçants du marché Hyppolite, contactés par Radio Télévision Douvanjou, se disent « prudemment optimistes ». Plusieurs d'entre eux réclament un calendrier précis et des garanties de continuité, rappelant que des opérations similaires avaient été interrompues par le passé.",
      "Les organisations de la société civile saluent l'annonce tout en appelant à une stratégie de plus long terme, intégrant la justice, l'emploi des jeunes et la reconstruction des quartiers touchés. Le Premier ministre a promis un premier bilan public dans trente jours.",
    ],
    image: img('rdm-securite-pap'),
    categoryId: 'haiti',
    authorId: 'jpb',
    tags: ['sécurité', 'Port-au-Prince', 'PNH', 'gouvernement'],
    status: 'publie',
    publishedAt: '2026-08-19T08:30:00',
    featured: true,
    breaking: true,
    views: 18420,
  },
  {
    id: 'a2',
    slug: 'conseil-electoral-calendrier-elections-2026',
    title: "Le Conseil électoral provisoire dévoile les grandes lignes du calendrier électoral 2026",
    excerpt:
      "Le CEP a présenté une feuille de route prévoyant l'enregistrement des électeurs dès l'automne et un premier tour envisagé avant la fin de l'année.",
    content: [
      "Le Conseil électoral provisoire a rendu publique une feuille de route électorale détaillée, première étape vers l'organisation de scrutins généraux attendus depuis plusieurs années. Le document prévoit le lancement des opérations d'enregistrement et d'identification dès l'automne, avec un déploiement prioritaire dans les chefs-lieux de département.",
      "Le calendrier envisage un premier tour des élections présidentielle et législatives avant la fin de l'année, sous réserve de l'amélioration des conditions de sécurité et de la disponibilité du financement international. Un référendum constitutionnel reste à l'étude, sans date arrêtée.",
      "Les partis politiques ont accueilli l'annonce avec une prudence unanime. Plusieurs formations réclament des garanties sur l'indépendance du conseil, la transparence du financement et l'accès équitable aux médias publics pendant la campagne.",
      "Les partenaires internationaux, par la voix de plusieurs ambassades à Port-au-Prince, ont salué « une étape encourageante » tout en rappelant que la crédibilité du processus dépendra de la participation des femmes, des jeunes et de la diaspora.",
    ],
    image: img('rdm-elections-cep'),
    categoryId: 'politique',
    authorId: 'mrd',
    tags: ['élections', 'CEP', 'démocratie'],
    status: 'publie',
    publishedAt: '2026-08-18T17:00:00',
    featured: true,
    views: 12980,
  },
  {
    id: 'a3',
    slug: 'gourde-stabilisation-mesures-brh',
    title: "La gourde se stabilise : la BRH annonce de nouvelles mesures pour soutenir le marché des changes",
    excerpt:
      "La Banque de la République d'Haïti injecte des liquidités en devises et resserre la supervision des transferts pour consolider la stabilité récente de la monnaie nationale.",
    content: [
      "Après plusieurs semaines d'appréciation relative, la gourde semble se stabiliser sur le marché des changes. La Banque de la République d'Haïti a confirmé cette tendance en annonçant une série de mesures destinées à la consolider : injections ciblées de devises sur le marché interbancaire, resserrement des règles de déclaration pour les sociétés de transfert et plafonnement de certaines positions spéculatives.",
      "Le gouverneur de la banque centrale a souligné que la remontée des transferts de la diaspora et la discipline budgétaire du Trésor public expliquent en partie cette accalmie. Il a toutefois prévenu que la stabilité resterait « fragile » tant que la production nationale et les exportations ne repartiraient pas.",
      "Du côté des importateurs, on salue une visibilité retrouvée pour fixer les prix, même si le coût du panier de la ménagère reste élevé. Les économistes interrogés par Radio Télévision Douvanjou appellent à profiter de la fenêtre pour assainir le marché des changes et rapprocher les taux officiel et parallèle.",
    ],
    image: img('rdm-gourde-brh'),
    categoryId: 'economie',
    authorId: 'wj',
    tags: ['gourde', 'BRH', 'économie', 'inflation'],
    status: 'publie',
    publishedAt: '2026-08-18T11:15:00',
    featured: true,
    views: 9540,
  },
  {
    id: 'a4',
    slug: 'rentree-scolaire-2026-defis-parents',
    title: "Rentrée scolaire 2026 : entre frais en hausse et effectifs incertains, les parents s'organisent",
    excerpt:
      "À quelques semaines de la rentrée, les familles jonglent entre la hausse des frais de scolarité, le coût des fournitures et la fermeture temporaire de plusieurs écoles dans la capitale.",
    content: [
      "À trois semaines de la rentrée des classes, les librairies et marchés de fournitures scolaires de Port-au-Prince connaissent leur traditionnelle effervescence — mais avec, cette année, une inquiétude palpable. Les parents interrogés par Radio Télévision Douvanjou évoquent des frais de scolarité en hausse de 10 à 25 % dans de nombreuses écoles privées, auxquels s'ajoutent le coût des uniformes et des manuels.",
      "Le ministère de l'Éducation nationale indique avoir ouvert des négociations avec les associations d'écoles privées pour encadrer les augmentations et élargir le programme de cantines scolaires. Un fonds d'urgence doit également soutenir la réouverture des établissements déplacés de certains quartiers de la capitale.",
      "Dans les départements, la situation est contrastée : si les effectifs s'annoncent stables aux Cayes et au Cap-Haïtien, plusieurs écoles de l'Artibonite accueilleront des élèves déplacés de la métropole. Les syndicats d'enseignants rappellent, eux, que le paiement des arriérés de salaires conditionnera une rentrée sereine.",
    ],
    image: img('rdm-rentree-scolaire'),
    categoryId: 'education',
    authorId: 'jpb',
    tags: ['éducation', 'rentrée scolaire', 'MENFP'],
    status: 'publie',
    publishedAt: '2026-08-17T09:00:00',
    views: 7230,
  },
  {
    id: 'a5',
    slug: 'festival-jacmel-film-2026-programmation',
    title: "Le Festival film de Jacmel dévoile une programmation 2026 placée sous le signe des mémoires",
    excerpt:
      "Documentaires, courts-métrages de la relève et rétrospective du cinéma houngan : la nouvelle édition du festival promet dix jours denses au bord de la mer.",
    content: [
      "Le Festival film de Jacmel a présenté l'ossature de sa programmation 2026 : plus de soixante films projetés en dix jours, entre la salle paroissiale, le front de mer et plusieurs cours d'écoles transformées en cinémas de plein air. Le thème retenu, « Mémoires vives », traversera compétitions, ateliers et rencontres professionnelles.",
      "La sélection officielle donne une large place aux documentaires haïtiens et caribéens, avec une section spéciale consacrée aux archives familiales et aux films restaurés. Une rétrospective rendra hommage aux pionniers du cinéma haïtien, avec des copies nouvellement numérisées.",
      "Côté formation, les ateliers Ciné Institute ouvriront leurs portes à des résidents de toute la Caraïbe, et un fonds de post-production doté de plusieurs dizaines de milliers de dollars récompensera deux projets de la relève. La billetterie solidaire, inaugurée l'an dernier, est reconduite : chaque place achetée finance une entrée gratuite pour un lycéen de la région.",
    ],
    image: img('rdm-festival-jacmel'),
    categoryId: 'culture',
    authorId: 'ncf',
    tags: ['cinéma', 'Jacmel', 'festival'],
    status: 'publie',
    publishedAt: '2026-08-16T14:45:00',
    views: 5120,
  },
  {
    id: 'a6',
    slug: 'grenadiers-victoire-qualifications-mondial',
    title: "Les Grenadiers s'imposent 2-0 et prennent la tête de leur groupe de qualification",
    excerpt:
      "Solides en défense et tranchants en contre, les Grenadiers ont dominé leur adversaire du soir et font un pas décisif vers la phase finale des qualifications.",
    content: [
      "Dans un stade comble et bouillant, la sélection haïtienne s'est imposée 2-0 grâce à un but en première période et une réalisation en contre à vingt minutes du terme. La défense, impeccable, a préservé une troisième clean sheet consécutive.",
      "Le sélectionneur a salué « la discipline collective » de son groupe et la montée en puissance des jeunes cadres évoluant en Europe. Le capitaine, auteur d'une passe décisive, a dédié la victoire « au peuple haïtien qui en a tant besoin ».",
      "Avec ce succès, Haïti prend seule la tête de son groupe, à deux journées de la fin de la phase. Une victoire lors du prochain match à domicile validerait mathématiquement la qualification pour le tour suivant. La fédération annoncera cette semaine les modalités de billetterie, avec un dispositif anti-revente au marché noir.",
    ],
    image: img('rdm-grenadiers-foot'),
    categoryId: 'sport',
    authorId: 'rs',
    tags: ['football', 'Grenadiers', 'qualifications'],
    status: 'publie',
    publishedAt: '2026-08-19T06:10:00',
    breaking: true,
    views: 15230,
  },
  {
    id: 'a7',
    slug: 'sommet-caricom-haiti-agenda',
    title: "Sommet de la CARICOM : la situation haïtienne au centre des discussions des chefs d'État",
    excerpt:
      "Sécurité, appui électoral et corridor humanitaire : les dirigeants caribéens ont placé Haïti en tête d'un agenda chargé, avec des annonces concrètes attendues.",
    content: [
      "Les chefs d'État et de gouvernement de la CARICOM ont ouvert leur sommet semestriel avec, en tête de l'agenda, la situation en Haïti. Plusieurs dirigeants ont plaidé pour un appui régional accru à la mission de sécurité et pour l'accélération du processus électoral porté par les Haïtiens eux-mêmes.",
      "Au menu également : la création d'un corridor humanitaire maritime, un mécanisme caribéen de financement de la reconstruction et l'élargissement des programmes de mobilité pour les étudiants et professionnels haïtiens. Une déclaration finale est attendue en clôture.",
      "La délégation haïtienne, conduite par le Premier ministre, a présenté les priorités du gouvernement de transition et demandé un calendrier d'appui aligné sur la feuille de route électorale. Les observateurs notent une tonalité plus constructive qu'aux précédents sommets.",
    ],
    image: img('rdm-caricom-sommet'),
    categoryId: 'international',
    authorId: 'ema',
    tags: ['CARICOM', 'diplomatie', 'Caraïbe'],
    status: 'publie',
    publishedAt: '2026-08-17T19:30:00',
    views: 4810,
  },
  {
    id: 'a8',
    slug: 'diaspora-montreal-fonds-entrepreneurs',
    title: "La diaspora de Montréal lance un fonds de 10 millions pour les entrepreneurs haïtiens",
    excerpt:
      "Un consortium d'hommes et de femmes d'affaires de la diaspora annonce un véhicule d'investissement dédié aux PME haïtiennes, de l'agro-industrie au numérique.",
    content: [
      "C'est une des plus importantes initiatives privées de la diaspora ces dernières années : un consortium d'entrepreneurs haïtiens établis au Québec annonce la création d'un fonds de 10 millions de dollars destiné à financer des PME en Haïti. Le véhicule ciblera l'agro-transformation, la logistique, l'énergie solaire et les services numériques.",
      "Les promoteurs promettent un processus de sélection transparent, avec un comité d'investissement mixte Montréal-Port-au-Prince et la publication annuelle d'un rapport d'impact. Un guichet unique accompagnera les porteurs de projets sur le montage des dossiers et la conformité fiscale.",
      "Les premiers tickets, de 50 000 à 500 000 dollars, devraient être débloqués dès le premier trimestre. Les chambres de commerce haïtiennes saluent l'initiative tout en appelant à y associer les institutions financières locales pour amplifier l'effet de levier.",
    ],
    image: img('rdm-diaspora-fonds'),
    categoryId: 'economie',
    authorId: 'ema',
    tags: ['diaspora', 'investissement', 'PME'],
    status: 'publie',
    publishedAt: '2026-08-15T10:00:00',
    views: 6340,
  },
  {
    id: 'a9',
    slug: 'sante-hopital-universitaire-mirebalais-scanner',
    title: "L'Hôpital universitaire de Mirebalais inaugure un plateau d'imagerie de pointe",
    excerpt:
      "Scanner 64 barrettes, téléradiologie et formation de techniciens : le plateau technique de l'hôpital de Mirebalais franchit un cap décisif pour tout le Plateau Central.",
    content: [
      "L'Hôpital universitaire de Mirebalais a inauguré un nouveau plateau d'imagerie comprenant un scanner 64 barrettes, une salle d'échographie interventionnelle et une unité de téléradiologie reliée à des centres universitaires nord-américains. L'équipement doit réduire de plusieurs semaines les délais de diagnostic pour les patients du Plateau Central et d'ailleurs.",
      "Le projet, financé par un partenariat public-privé et des fondations de la diaspora, comprend un volet formation : douze techniciens et quatre radiologues haïtiens seront certifiés sur deux ans, avec engagement de service dans le réseau public.",
      "Pour la direction de l'hôpital, l'enjeu dépasse la machine : « un diagnostic rapide change le pronostic de milliers de patients, des AVC aux cancers ». Le ministère de la Santé publique annonce vouloir répliquer le modèle dans deux autres hôpitaux de département.",
    ],
    image: img('rdm-hopital-mirebalais'),
    categoryId: 'societe',
    authorId: 'jpb',
    tags: ['santé', 'Mirebalais', 'MSPP'],
    status: 'publie',
    publishedAt: '2026-08-14T08:20:00',
    views: 3980,
  },
  {
    id: 'a10',
    slug: 'compas-nouvelle-generation-konpa',
    title: "Konpa nouvelle génération : comment la scène réinvente le compas sans le renier",
    excerpt:
      "Entre respect des codes et hybridations afrobeats et drill, une génération de producteurs et de chanteurs redessine les contours du compas pour les dancefloors de 2026.",
    content: [
      "À Port-au-Prince comme à Miami ou Paris, une génération de producteurs née avec le millénaire réécrit la grammaire du compas : guitare délayée conservée, mais batterie plus sèche, nappes électroniques et featurings avec des artistes afrobeats ou dancehall. Le résultat, baptisé « konpa nouvelle génération », cartonne sur les plateformes.",
      "Les aînés observent le mouvement avec un mélange de fierté et de vigilance. « Le compas a toujours absorbé ce qui l'entourait, rappelle un guitariste historique. L'essentiel est que la ligne de guitare et le swing restent haïtiens. »",
      "Signe des temps : les soirées konpa attirent de nouveau un public jeune dans la capitale, et plusieurs festivals internationaux programment des scènes dédiées. Radio Télévision Douvanjou consacrera une émission spéciale au phénomène ce week-end, avec sessions live et débat entre générations.",
    ],
    image: img('rdm-konpa-musique'),
    categoryId: 'culture',
    authorId: 'ncf',
    tags: ['musique', 'konpa', 'compas'],
    status: 'publie',
    publishedAt: '2026-08-13T16:00:00',
    views: 8450,
  },
  {
    id: 'a11',
    slug: 'agriculture-artibonite-irrigation-rehabilitation',
    title: "Artibonite : la réhabilitation des canaux relance l'espoir d'une grande campagne rizicole",
    excerpt:
      "Après des mois de travaux sur les canaux d'irrigation, les producteurs de la plaine de l'Artibonite préparent une campagne que les coopératives veulent historique.",
    content: [
      "Les engins quittent à peine les berges que l'eau court déjà dans plusieurs tronçons réhabilités du réseau d'irrigation de l'Artibonite. Pour les producteurs de la plaine, grenier rizicole du pays, c'est la condition d'une campagne enfin à la hauteur du potentiel des terres.",
      "Le programme, mené avec l'appui de partenaires internationaux, comprend le curage des canaux secondaires, la réparation des vannes et la formation d'associations d'usagers chargées de l'entretien. Les coopératives prévoient une mise en culture en hausse de 30 % par rapport à la dernière campagne.",
      "Reste la question du prix : les producteurs réclament un prix plancher d'achat du paddy et un stockage public pour lisser les marchés. Le ministère de l'Agriculture dit étudier un mécanisme d'intervention avec les moulins de la plaine.",
    ],
    image: img('rdm-artibonite-riz'),
    categoryId: 'economie',
    authorId: 'wj',
    tags: ['agriculture', 'Artibonite', 'riz'],
    status: 'publie',
    publishedAt: '2026-08-12T07:40:00',
    views: 3120,
  },
  {
    id: 'a12',
    slug: 'technologie-startups-fintech-haiti',
    title: "Fintech haïtienne : trois startups locales passent le cap du million d'utilisateurs",
    excerpt:
      "Paiements mobiles, tontines digitalisées et micro-crédit : la fintech haïtienne grandit vite, portée par la diaspora et un usage mobile de masse.",
    content: [
      "Trois applications de paiement et d'épargne développées par des équipes haïtiennes viennent de franchir, ensemble, le cap du million d'utilisateurs actifs. Leurs usages vedettes : la réception de transferts de la diaspora à frais réduits, la tontine digitalisée et le paiement marchand par QR code.",
      "Leur croissance s'appuie sur un réseau d'agents de proximité pour l'entrée et la sortie d'espèces, et sur des partenariats avec les opérateurs télécoms. La BRH, qui supervise le secteur via son cadre de monnaie électronique, dit préparer une mise à jour de la réglementation pour accompagner l'expansion tout en protégeant les consommateurs.",
      "Prochaine frontière : le micro-crédit scoré sur les historiques de transactions, testé actuellement auprès de marchandes et de moto-taxis. Les fondateurs affichent l'ambition de faire d'Haïti un laboratoire caribéen de l'inclusion financière.",
    ],
    image: img('rdm-fintech-haiti'),
    categoryId: 'technologie',
    authorId: 'wj',
    tags: ['fintech', 'startups', 'mobile money'],
    status: 'publie',
    publishedAt: '2026-08-11T13:25:00',
    views: 5670,
  },
  {
    id: 'a13',
    slug: 'cyclone-saison-2026-preparation-civil',
    title: "Saison cyclonique 2026 : la protection civile monte d'un cran ses exercices de préparation",
    excerpt:
      "Simulations d'évacuation, refonte des abris et campagne de sensibilisation : le dispositif national se prépare à une saison annoncée active.",
    content: [
      "Les services météorologiques régionaux prévoient une saison cyclonique active dans l'Atlantique. En conséquence, la Direction de la protection civile a avancé son calendrier : exercices d'évacuation dans les communes côtières, inventaire et renforcement des abris provisoires, et campagne multilingue de sensibilisation sur radio et réseaux sociaux.",
      "Nouveauté cette année : un système d'alerte par SMS géolocalisés, testé avec les opérateurs, et des « brigades communales » formées à la recherche et au sauvetage de base. Les stocks de kits — eau, bâches, médicaments — sont en cours de prépositionnement dans les dix départements.",
      "Les autorités rappellent les réflexes essentiels : document de famille à l'abri, réserve de trois jours, repères d'évacuation connus de tous les membres du foyer. Radio Télévision Douvanjou relaiera les bulletins officiels en continu tout au long de la saison.",
    ],
    image: img('rdm-cyclone-preparation'),
    categoryId: 'haiti',
    authorId: 'jpb',
    tags: ['cyclones', 'protection civile', 'prévention'],
    status: 'publie',
    publishedAt: '2026-08-10T09:50:00',
    views: 4210,
  },
  {
    id: 'a14',
    slug: 'athletisme-record-national-100m',
    title: "Athlétisme : nouveau record national du 100 mètres pour la relève haïtienne",
    excerpt:
      "En 10 secondes 02, un sprinteur de 21 ans abaisse le record national du 100 m et se qualifie pour les prochains championnats du monde.",
    content: [
      "Le chrono est tombé sous une pluie fine : 10 secondes 02, vent favorable, record national du 100 mètres effacé de quatre centièmes. À 21 ans, le sprinteur haïtien signe aussi sa qualification pour les prochains championnats du monde.",
      "Formé entre Port-au-Prince et une université américaine, il incarne la génération montante de l'athlétisme haïtien, soutenue par un programme de bourses et de stages. Son entraîneur vise désormais la barrière des 10 secondes, « à portée si l'hiver d'entraînement se passe bien ».",
      "La fédération, qui alignera une délégation record aux prochains Jeux d'Amérique centrale et Caraïbes, demande la réhabilitation accélérée de la piste nationale pour retenir les stages au pays plutôt qu'à l'étranger.",
    ],
    image: img('rdm-athletisme-100m'),
    categoryId: 'sport',
    authorId: 'rs',
    tags: ['athlétisme', 'record', 'sprint'],
    status: 'publie',
    publishedAt: '2026-08-09T18:05:00',
    views: 6890,
  },
  {
    id: 'a15',
    slug: 'litterature-prix-carabet-romanciere',
    title: "Une romancière haïtienne lauréate du prix Carbet de la Caraïbe",
    excerpt:
      "Son roman choral sur trois générations de femmes de Jérémie a convaincu le jury, qui salue « une langue créole-française d'une rare musicalité ».",
    content: [
      "Le prix Carbet de la Caraïbe et des Amériques insulaires a été décerné à une romancière haïtienne pour un roman choral traversant soixante ans de l'histoire de Jérémie à travers trois générations de femmes. Le jury a salué « une langue créole-française d'une rare musicalité » et une architecture narrative « à la fois intime et politique ».",
      "Le livre, déjà traduit en anglais et en espagnol, paraîtra cet automne dans une nouvelle édition augmentée d'un cahier de photographies. La lauréate a dédié son prix « aux bibliothèques de quartier qui m'ont appris à lire ».",
      "À Port-au-Prince, libraires et maisons d'édition notent un regain d'intérêt pour la littérature haïtienne, porté par les festivals du livre et les clubs de lecture en ligne. Un entretien exclusif avec la romancière sera diffusé ce dimanche dans notre émission « Plumes & Racines ».",
    ],
    image: img('rdm-prix-carabet'),
    categoryId: 'culture',
    authorId: 'ncf',
    tags: ['littérature', 'prix Carbet', 'roman'],
    status: 'publie',
    publishedAt: '2026-08-08T15:30:00',
    views: 2870,
  },
  {
    id: 'a16',
    slug: 'senat-vote-loi-finances-rectificative',
    title: "Le Sénat vote la loi de finances rectificative après trois jours de débats",
    excerpt:
      "Adopté à une large majorité, le budget rectificatif réaffecte des crédits vers la sécurité, l'éducation et le filet social, avec un volet transparence salué par la société civile.",
    content: [
      "Après trois jours de débats parfois houleux, le Sénat a adopté la loi de finances rectificative à une large majorité. Le texte réaffecte l'équivalent de plusieurs points de PIB vers la sécurité, la rentrée scolaire et les programmes de transferts monétaires, tout en sanctuarisant les arriérés des enseignants.",
      "Fait notable : un chapitre entier impose la publication trimestrielle en ligne des marchés publics et des rapports d'exécution budgétaire, une revendication de longue date des organisations de la société civile, qui parlent d'« un précédent à consolider ».",
      "Le texte part maintenant à la Chambre des députés, où le gouvernement espère un vote avant la fin du mois. Les économistes suivent de près la trajectoire du déficit et le refinancement de la dette intérieure à des taux en baisse.",
    ],
    image: img('rdm-senat-budget'),
    categoryId: 'politique',
    authorId: 'mrd',
    tags: ['Sénat', 'budget', 'Parlement'],
    status: 'publie',
    publishedAt: '2026-08-07T21:10:00',
    views: 4430,
  },
  {
    id: 'a17',
    slug: 'evenement-carnaval-fleurs-cayes-2026',
    title: "Le Carnaval des Fleurs des Cayes dévoile son affiche et son dispositif 2026",
    excerpt:
      "Trois jours de défilés, un village artisana agrandi et un dispositif sécurité-mobilité revu : les Cayes préparent l'édition la plus ambitieuse de leur carnaval.",
    content: [
      "Le comité du Carnaval des Fleurs a présenté l'affiche et le dispositif de l'édition 2026 : trois jours de défilés sur le front de mer des Cayes, un village artisana et gastronomique agrandi d'un tiers, et une scène dédiée aux groupes racines et rara du Sud.",
      "Côté organisation, la mairie annonce un plan mobilité avec navettes depuis les parkings extérieurs, un centre de commandement conjoint sécurité-santé et un dispositif « carnaval propre » avec consignes de gobelets réutilisables.",
      "L'événement, qui draine chaque année des dizaines de milliers de visiteurs, est attendu comme un moteur économique majeur pour le département. Les hôteliers affichent déjà des taux de réservation records.",
    ],
    image: img('rdm-carnaval-cayes'),
    categoryId: 'culture',
    authorId: 'ncf',
    tags: ['carnaval', 'Les Cayes', 'tourisme'],
    status: 'publie',
    publishedAt: '2026-08-06T12:00:00',
    views: 5120,
  },
  {
    id: 'a18',
    slug: 'basket-dame-mondial-qualification',
    title: "Basket : l'équipe nationale féminine à une victoire du mondial",
    excerpt:
      "Après un succès arraché en prolongation, les basketteuses haïtiennes joueront leur qualification pour la Coupe du monde lors de l'ultime journée du tournoi.",
    content: [
      "Il a fallu une prolongation et un lancer décisif à deux secondes de la sirène, mais l'équipe nationale féminine de basket a validé l'essentiel : une victoire qui la place à un succès de la première qualification de son histoire pour la Coupe du monde.",
      "Portées par une meneuse de 19 ans formée au pays et une intérieure évoluant en ligue européenne, les Haïtiennes ont renversé un match mal embarqué à la mi-temps. Le staff salue « une culture de défense » construite sur trois ans de camps.",
      "L'ultime journée du tournoi se jouera dans trois jours. La fédération appelle la diaspora à garnir les tribunes, et Radio Télévision Douvanjou retransmettra la rencontre en direct à la radio et en commentaires écrits sur le site.",
    ],
    image: img('rdm-basket-femmes'),
    categoryId: 'sport',
    authorId: 'rs',
    tags: ['basket', 'équipe nationale', 'femmes'],
    status: 'publie',
    publishedAt: '2026-08-05T22:40:00',
    views: 7340,
  },
  {
    id: 'a19',
    slug: 'mangrove-protection-cote-sud',
    title: "Côte Sud : une coalition de pêcheurs et d'ONG replante 200 hectares de mangrove",
    excerpt:
      "Pépinières villageoises, crédits carbone et patrouilles communales : un programme de restauration de la mangrove prend de l'ampleur sur la côte Sud.",
    content: [
      "Entre Aquin et Saint-Louis-du-Sud, une coalition d'associations de pêcheurs et d'ONG environnementales vient de boucler la plantation de 200 hectares de mangrove, avec objectif de 500 hectares à l'horizon 2028. Pépinières villageoises, emplois de jeunes et patrouilles communales anti-coupe forment le socle du dispositif.",
      "Le programme s'adosse à un mécanisme de crédits carbone dont les revenus abreuvent un fonds cogéré par les communes : écoles, points d'eau et caisses de solidarité de pêcheurs en sont les premiers bénéficiaires.",
      "Les scientifiques du consortium rappellent l'enjeu : la mangrove protège les côtes des ondes de tempête, abrite le frai des poissons et stocke plusieurs fois plus de carbone qu'une forêt sèche. Les premiers signes de retour des nurseries de poissons sont déjà documentés.",
    ],
    image: img('rdm-mangrove-sud'),
    categoryId: 'societe',
    authorId: 'jpb',
    tags: ['environnement', 'mangrove', 'climat'],
    status: 'publie',
    publishedAt: '2026-08-04T08:00:00',
    views: 2540,
  },
  {
    id: 'a20',
    slug: 'aviation-nouvelle-liaison-port-au-prince',
    title: "Une nouvelle liaison aérienne reliera Port-au-Prince à trois capitales caribéennes",
    excerpt:
      "Annoncée pour la fin de l'année, la ligne doit fluidifier les échanges d'affaires et le tourisme régional, avec des tarifs de lancement agressifs.",
    content: [
      "Une compagnie régionale desservira d'ici la fin de l'année Port-au-Prince depuis trois capitales caribéennes, avec quatre fréquences hebdomadaires et des tarifs de lancement annoncés 30 % sous les prix actuels du marché.",
      "Les opérateurs touristiques haïtiens saluent une bouffée d'oxygène pour la desserte du pays, tout en rappelant que la reprise pleine du tourisme dépendra de la sécurité et de la fiabilité des infrastructures aéroportuaires.",
      "L'Office national de l'aviation civile précise que la licence a été accordée après audit de sécurité, et que des discussions sont ouvertes pour une liaison cargo dédiée aux exportations agricoles vers la Caraïbe du Nord.",
    ],
    image: img('rdm-aviation-liaison'),
    categoryId: 'economie',
    authorId: 'wj',
    tags: ['aviation', 'transport', 'tourisme'],
    status: 'publie',
    publishedAt: '2026-08-03T10:30:00',
    views: 3680,
  },
]

// ------------------------------------------------------------
// Émissions
// ------------------------------------------------------------
export const shows: Show[] = [
  {
    id: 's1',
    name: 'Douvanjou Matin',
    image: img('rdm-show-matin', 800, 800),
    description:
      "Le rendez-vous info du réveil : revue de presse, grands entretiens, météo, trafic et le journal de 7h décrypté par la rédaction.",
    host: 'Jean-Pierre Baptiste & Marie-Rose Delva',
    schedule: 'Lun–Ven · 6h00 – 9h00',
    category: 'Information',
    episodes: [
      { id: 's1e1', title: 'Revue de presse et entretien avec le porte-parole du gouvernement', date: '2026-08-19', duration: '2 h 58' },
      { id: 's1e2', title: 'Spéciale rentrée scolaire : parents, écoles, ministère', date: '2026-08-18', duration: '2 h 55' },
      { id: 's1e3', title: 'Économie : la gourde se stabilise, que change-t-il pour vous ?', date: '2026-08-17', duration: '2 h 51' },
    ],
  },
  {
    id: 's2',
    name: 'Le Débat',
    image: img('rdm-show-debat', 800, 800),
    description:
      "Une heure de confrontation d'idées sur la question qui divise la semaine, avec invités contradictoires et questions des auditeurs.",
    host: 'Marie-Rose Delva',
    schedule: 'Mer · 19h00 – 20h30',
    category: 'Débat',
    episodes: [
      { id: 's2e1', title: 'Élections 2026 : le calendrier est-il tenable ?', date: '2026-08-13', duration: '1 h 28' },
      { id: 's2e2', title: 'Sécurité : que peut encore l\'État ?', date: '2026-08-06', duration: '1 h 31' },
    ],
  },
  {
    id: 's3',
    name: 'Konpa Non Stop',
    image: img('rdm-show-konpa', 800, 800),
    description:
      "Le meilleur du compas, du classique à la nouvelle génération : mixes, nouveautés, lives studio et histoire des groupes légendaires.",
    host: 'DJ Wilguens',
    schedule: 'Ven–Sam · 21h00 – 00h00',
    category: 'Musique',
    episodes: [
      { id: 's3e1', title: 'Spéciale nouvelle génération konpa', date: '2026-08-15', duration: '2 h 58' },
      { id: 's3e2', title: 'Légendes du compas : les guitares qui ont fait danser Haïti', date: '2026-08-08', duration: '2 h 55' },
    ],
  },
  {
    id: 's4',
    name: 'Plumes & Racines',
    image: img('rdm-show-plumes', 800, 800),
    description:
      "Littérature, théâtre, arts visuels : le magazine culturel qui fait entendre les voix qui écrivent et créent Haïti aujourd'hui.",
    host: 'Nathalie C. François',
    schedule: 'Dim · 10h00 – 11h30',
    category: 'Culture',
    episodes: [
      { id: 's4e1', title: 'Entretien exclusif avec la lauréate du prix Carbet', date: '2026-08-17', duration: '1 h 26' },
      { id: 's4e2', title: 'Le renouveau du théâtre en créole', date: '2026-08-10', duration: '1 h 24' },
    ],
  },
  {
    id: 's5',
    name: 'Zone Sport',
    image: img('rdm-show-sport', 800, 800),
    description:
      "Tout le sport haïtien et de la diaspora : Grenadiers, basket, boxe, athlétisme, résultats, analyses et invités du terrain.",
    host: 'Ricardo Saint-Fleur',
    schedule: 'Lun–Ven · 17h00 – 18h00',
    category: 'Sport',
    episodes: [
      { id: 's5e1', title: 'Debrief : Grenadiers 2-0, cap sur la qualification', date: '2026-08-19', duration: '58 min' },
      { id: 's5e2', title: 'Basket féminin : à une victoire du mondial', date: '2026-08-06', duration: '57 min' },
    ],
  },
  {
    id: 's6',
    name: 'Diaspora Connection',
    image: img('rdm-show-diaspora', 800, 800),
    description:
      "Le pont hebdomadaire entre Haïti et sa diaspora : réussites, débats transatlantiques, services pratiques et musique des deux rives.",
    host: 'Ernst M. André',
    schedule: 'Sam · 16h00 – 18h00',
    category: 'Société',
    episodes: [
      { id: 's6e1', title: 'Un fonds de 10 millions pour les entrepreneurs du pays', date: '2026-08-16', duration: '1 h 57' },
      { id: 's6e2', title: 'Étudier au Québec : le guide pratique 2026', date: '2026-08-09', duration: '1 h 55' },
    ],
  },
]

// ------------------------------------------------------------
// Podcasts
// ------------------------------------------------------------
export const podcasts: Podcast[] = [
  {
    id: 'p1',
    title: 'Élections 2026 : comprendre la feuille de route du CEP',
    show: 'Le Débat',
    cover: img('rdm-podcast-elections', 600, 600),
    description:
      "Décryptage de la feuille de route électorale : enregistrement, financement, sécurité du vote et ce que les partis en disent vraiment.",
    duration: '48 min',
    date: '2026-08-18',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'Politique',
  },
  {
    id: 'p2',
    title: 'La gourde se stabilise : que change-t-il pour votre portefeuille ?',
    show: 'Douvanjou Matin',
    cover: img('rdm-podcast-gourde', 600, 600),
    description:
      "Avec deux économistes, on démonte les mécanismes de la stabilisation de la gourde et ses effets concrets sur les prix et les transferts.",
    duration: '36 min',
    date: '2026-08-18',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    category: 'Économie',
  },
  {
    id: 'p3',
    title: 'Konpa nouvelle génération : révolution ou continuité ?',
    show: 'Konpa Non Stop',
    cover: img('rdm-podcast-konpa', 600, 600),
    description:
      "Producteurs, guitaristes historiques et artistes de la relève débattent de l'avenir du compas à l'ère des plateformes.",
    duration: '54 min',
    date: '2026-08-15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'Culture',
  },
  {
    id: 'p4',
    title: 'Mangrove : la côte Sud replante son bouclier',
    show: 'Reportages RTD',
    cover: img('rdm-podcast-mangrove', 600, 600),
    description:
      "Reportage dans les pépinières d'Aquin : pêcheurs, scientifiques et élus racontent la restauration de 200 hectares de mangrove.",
    duration: '27 min',
    date: '2026-08-12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    category: 'Société',
  },
  {
    id: 'p5',
    title: 'Grenadiers : le chemin vers la qualification, analyse tactique',
    show: 'Zone Sport',
    cover: img('rdm-podcast-grenadiers', 600, 600),
    description:
      "Analyse du 2-0 des Grenadiers : le plan de jeu, les jeunes cadres et ce qu'il reste à valider pour la qualification.",
    duration: '41 min',
    date: '2026-08-19',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    category: 'Sport',
  },
  {
    id: 'p6',
    title: 'Prix Carbet : entretien avec la romancière lauréate',
    show: 'Plumes & Racines',
    cover: img('rdm-podcast-carbet', 600, 600),
    description:
      "La lauréate du prix Carbet se confie sur Jérémie, l'écriture entre créole et français, et les bibliothèques de son enfance.",
    duration: '45 min',
    date: '2026-08-17',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    category: 'Culture',
  },
]

// ------------------------------------------------------------
// Vidéos
// ------------------------------------------------------------
export const videos: Video[] = [
  {
    id: 'v1',
    title: 'Reportage : le centre-ville de Port-au-Prince entre espoir et reconstruction',
    thumbnail: img('rdm-video-reportage-pap', 1000, 563),
    duration: '12:48',
    date: '2026-08-18',
    category: 'Reportages',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 24500,
    description:
      "Nos équipes ont parcouru le centre de la capitale : commerçants, résidents et autorités racontent un territoire qui veut revivre.",
  },
  {
    id: 'v2',
    title: 'Interview : le gouverneur de la BRH sur la stabilisation de la gourde',
    thumbnail: img('rdm-video-brh', 1000, 563),
    duration: '24:10',
    date: '2026-08-18',
    category: 'Interviews',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 18200,
    description:
      "Le grand entretien économique de la semaine : changes, inflation, transferts de la diaspora et discipline budgétaire.",
  },
  {
    id: 'v3',
    title: 'Débat : le calendrier électoral 2026 est-il tenable ?',
    thumbnail: img('rdm-video-debat-cep', 1000, 563),
    duration: '58:32',
    date: '2026-08-13',
    category: 'Débats',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 31800,
    description:
      "Constitutionnalistes, partis et société civile confrontent leurs analyses sur la feuille de route du CEP.",
  },
  {
    id: 'v4',
    title: 'Documentaire : la mangrove, forteresse de la côte Sud',
    thumbnail: img('rdm-video-mangrove', 1000, 563),
    duration: '42:15',
    date: '2026-08-10',
    category: 'Documentaires',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 15600,
    description:
      "Un an de tournage entre Aquin et Saint-Louis-du-Sud pour raconter la restauration de la mangrove et ceux qui la font vivre.",
  },
  {
    id: 'v5',
    title: 'Émission : Konpa Non Stop, session live nouvelle génération',
    thumbnail: img('rdm-video-konpa-live', 1000, 563),
    duration: '1:12:04',
    date: '2026-08-15',
    category: 'Émissions',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 52300,
    description:
      "Trois groupes de la nouvelle scène konpa en session live au studio, avec le public de l'émission.",
  },
  {
    id: 'v6',
    title: 'Culture : dans les coulisses du Festival film de Jacmel',
    thumbnail: img('rdm-video-jacmel', 1000, 563),
    duration: '18:47',
    date: '2026-08-16',
    category: 'Culture',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 9800,
    description:
      "Projection de plein air, ateliers de la relève et restauration de classiques : immersion dans la préparation du festival.",
  },
  {
    id: 'v7',
    title: 'Sport : les buts et les coulisses de Grenadiers 2-0',
    thumbnail: img('rdm-video-grenadiers', 1000, 563),
    duration: '09:56',
    date: '2026-08-19',
    category: 'Sport',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 61400,
    description:
      "Les deux buts, les arrêts et les réactions du vestiaire après la victoire qui place Haïti en tête de son groupe.",
  },
  {
    id: 'v8',
    title: 'Reportage : la fintech haïtienne passe le million d\'utilisateurs',
    thumbnail: img('rdm-video-fintech', 1000, 563),
    duration: '15:21',
    date: '2026-08-11',
    category: 'Reportages',
    source: 'hosted',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    views: 11400,
    description:
      "Agents de proximité, tontines digitalisées, micro-crédit : enquête sur les applications qui changent l'argent au quotidien.",
  },
]

// ------------------------------------------------------------
// Événements
// ------------------------------------------------------------
export const events: EventItem[] = [
  {
    id: 'e1',
    title: 'Festival film de Jacmel 2026',
    image: img('rdm-event-jacmel', 1000, 700),
    date: '2026-10-02',
    time: 'Toute la journée',
    location: 'Jacmel, Sud-Est',
    category: 'Festival',
    description:
      "Dix jours de projections, ateliers et rencontres autour du thème « Mémoires vives », entre salle paroissiale et cinémas de plein air.",
    price: 'Entrée libre et billetterie solidaire',
  },
  {
    id: 'e2',
    title: 'Carnaval des Fleurs des Cayes',
    image: img('rdm-event-carnaval', 1000, 700),
    date: '2026-09-12',
    time: '14h00 – 02h00',
    location: 'Les Cayes, Sud',
    category: 'Carnaval',
    description:
      "Trois jours de défilés, village artisana et scène racines-rara sur le front de mer des Cayes.",
    price: 'Gratuit',
  },
  {
    id: 'e3',
    title: 'Match de qualification : Haïti vs. rival du groupe',
    image: img('rdm-event-match', 1000, 700),
    date: '2026-09-05',
    time: '19h00',
    location: 'Stade national, Port-au-Prince',
    category: 'Sport',
    description:
      "Une victoire valide la qualification des Grenadiers. Billetterie officielle avec dispositif anti-revente.",
    price: 'À partir de 500 HTG',
  },
  {
    id: 'e4',
    title: 'Salon du livre et de la pensée créole',
    image: img('rdm-event-livre', 1000, 700),
    date: '2026-11-20',
    time: '09h00 – 18h00',
    location: 'Karibe, Pétion-Ville',
    category: 'Littérature',
    description:
      "Rencontres, signatures et tables rondes avec la lauréate du prix Carbet et trente auteurs d'Haïti et de la diaspora.",
    price: 'Entrée libre',
  },
  {
    id: 'e5',
    title: 'Concert symphonique : Haïti chante Noël',
    image: img('rdm-event-concert', 1000, 700),
    date: '2026-12-19',
    time: '19h30',
    location: 'Sainte-Trinité, Port-au-Prince',
    category: 'Concert',
    description:
      "L'orchestre philharmonique et les chœurs réunis pour le concert de fin d'année, entre classiques et noëls créoles.",
    price: 'À partir de 1 000 HTG',
  },
  {
    id: 'e6',
    title: 'Forum de la diaspora et de l\'investissement',
    image: img('rdm-event-forum', 1000, 700),
    date: '2026-10-24',
    time: '08h30 – 17h00',
    location: 'Montréal & en ligne',
    category: 'Économie',
    description:
      "Le fonds de 10 millions dévoile son guichet unique : pitchs de PME, ateliers fiscaux et rencontres investisseurs.",
    price: 'Inscription gratuite',
  },
]

// ------------------------------------------------------------
// Programmation radio (grille du jour)
// ------------------------------------------------------------
export interface ScheduleSlot {
  time: string
  show: string
  host: string
  live?: boolean
}

export const radioSchedule: ScheduleSlot[] = [
  { time: '05h00 – 06h00', show: 'Prière & Méditation', host: 'Pasteur E. Lubin' },
  { time: '06h00 – 09h00', show: 'Douvanjou Matin', host: 'J.-P. Baptiste & M.-R. Delva', live: true },
  { time: '09h00 – 11h00', show: 'Santé & Bien-être', host: 'Dr. F. Célestin' },
  { time: '11h00 – 13h00', show: 'Midi Info', host: 'La rédaction RTD' },
  { time: '13h00 – 15h00', show: 'Konpa Détente', host: 'DJ Wilguens' },
  { time: '15h00 – 17h00', show: 'Femmes & Société', host: 'N. C. François' },
  { time: '17h00 – 18h00', show: 'Zone Sport', host: 'R. Saint-Fleur' },
  { time: '18h00 – 19h00', show: 'Journal du soir', host: 'La rédaction RTD' },
  { time: '19h00 – 20h30', show: 'Le Débat', host: 'M.-R. Delva' },
  { time: '20h30 – 22h00', show: 'Balafon Diaspora', host: 'E. M. André' },
  { time: '22h00 – 00h00', show: 'Nuit Zouk & Slows', host: 'Automatique' },
]

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
export const getCategory = (id: string) => categories.find((c) => c.id === id)
export const getAuthor = (id: string) => authors.find((a) => a.id === id)

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')} k`
  return String(n)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
