// Dados de exemplo — MESMO formato do backend (ver docs/API.md)
// Cada export getX(lang) devolve a versão localizada; os exports estáticos são o fallback PT.

// ── Settings (campos sem tradução) ────────────────────────────────────
export const settings = {
  studioName: 'Badiu Digital',
  email: 'ola@badiudigital.com',
  socials: {
    instagram: 'https://instagram.com/badiudigital',
    linkedin:  'https://linkedin.com/company/badiudigital',
    github:    'https://github.com/badiudigital',
  },
};

// ── Services ──────────────────────────────────────────────────────────

const _servicesPt = [
  {
    id: 1, number: '01', title: 'Design',
    description: 'Identidade, interfaces e motion. Do primeiro rascunho ao sistema de design que cresce contigo.',
    tags: ['Marca', 'UI / UX', 'Motion'],
    includes: ['Identidade de marca', 'UI / UX de produto', 'Motion e protótipos', 'Design systems'],
  },
  {
    id: 2, number: '02', title: 'Desenvolvimento',
    description: 'Sites e aplicações rápidos, acessíveis e feitos para durar. Frontend com detalhe, backend sólido.',
    tags: ['React', 'Spring Boot', 'APIs'],
    includes: ['Sites e landing pages', 'Aplicações web', 'APIs e integrações', 'Pagamentos com Stripe'],
  },
  {
    id: 3, number: '03', title: 'Plataformas',
    description: 'Portais de cliente, áreas de equipa e produtos digitais completos, com contas, faturas e dados.',
    tags: ['Portais', 'Dashboards', 'Contas'],
    includes: ['Portais de cliente', 'Painéis e dashboards', 'Contas e permissões', 'Faturação'],
  },
  {
    id: 4, number: '04', title: 'Infraestrutura',
    description: 'Deploy, domínios, bases de dados e monitorização. O teu produto online, estável e seguro.',
    tags: ['Cloud', 'Docker', 'CI/CD'],
    includes: ['Cloud e deploy', 'Domínios e email', 'Bases de dados', 'Monitorização'],
  },
];

const _servicesEn = [
  {
    id: 1, number: '01', title: 'Design',
    description: 'Identity, interfaces and motion. From the first sketch to a design system that grows with you.',
    tags: ['Brand', 'UI / UX', 'Motion'],
    includes: ['Brand identity', 'Product UI / UX', 'Motion and prototypes', 'Design systems'],
  },
  {
    id: 2, number: '02', title: 'Development',
    description: 'Fast, accessible sites and applications built to last. Detailed frontend, solid backend.',
    tags: ['React', 'Spring Boot', 'APIs'],
    includes: ['Sites and landing pages', 'Web applications', 'APIs and integrations', 'Payments with Stripe'],
  },
  {
    id: 3, number: '03', title: 'Platforms',
    description: 'Client portals, team areas and complete digital products, with accounts, invoices and data.',
    tags: ['Portals', 'Dashboards', 'Accounts'],
    includes: ['Client portals', 'Panels and dashboards', 'Accounts and permissions', 'Invoicing'],
  },
  {
    id: 4, number: '04', title: 'Infrastructure',
    description: 'Deploy, domains, databases and monitoring. Your product online, stable and secure.',
    tags: ['Cloud', 'Docker', 'CI/CD'],
    includes: ['Cloud and deploy', 'Domains and email', 'Databases', 'Monitoring'],
  },
];

// Kriolu: rascunho para revisão
const _servicesKri = [
  {
    id: 1, number: '01', title: 'Dizain',
    description: 'Identidadi, interfasis i motion. Di primeru rasunhu ti sistema di dizain ki ta kria ku bo.',
    tags: ['Marka', 'UI / UX', 'Motion'],
    includes: ['Identidadi di marka', 'UI / UX di produtu', 'Motion i protótipus', 'Design systems'],
  },
  {
    id: 2, number: '02', title: 'Dizinvolvimentu',
    description: 'Sites i aplikasons rápidu, asesível i fetu pa dura. Frontend ku detalhi, backend sólidu.',
    tags: ['React', 'Spring Boot', 'APIs'],
    includes: ['Sites i landing pages', 'Aplikasons web', 'APIs i integrasons', 'Pagamentus ku Stripe'],
  },
  {
    id: 3, number: '03', title: 'Plataformas',
    description: 'Portal di klienti, área di ekipa i produtus dijital kompletu, ku kontas, faturas i dadus.',
    tags: ['Portal', 'Dashboards', 'Kontas'],
    includes: ['Portal di klienti', 'Painel i dashboards', 'Kontas i permison', 'Faturason'],
  },
  {
    id: 4, number: '04', title: 'Infraestrutura',
    description: 'Deploy, domíniu, bazi di dadus i monitorizason. Bu produtu online, stável i siguru.',
    tags: ['Cloud', 'Docker', 'CI/CD'],
    includes: ['Cloud i deploy', 'Domíniu i email', 'Bazi di dadus', 'Monitorizason'],
  },
];

export const services = _servicesPt;
export function getServices(lang) {
  if (lang === 'en')  return _servicesEn;
  if (lang === 'kri') return _servicesKri;
  return _servicesPt;
}

// ── Projects ──────────────────────────────────────────────────────────

const _projectsPt = [
  {
    id: 1, slug: 'batuku', name: 'Batuku', shortName: 'Bk', status: 'IN_DEVELOPMENT', featured: true,
    summary:     'Descoberta e monetização para artistas independentes cabo-verdianos.',
    description: 'Plataforma de música com perfis de artista, analytics, gamificação e marketplace de beats.',
    tags: ['React', 'Spring Boot', 'MySQL'], coverColor: '#2A1D15', coverTextColor: '#A9714A', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Fundador · full stack' }],
  },
  {
    id: 2, slug: 'fla', name: 'Fla', shortName: 'Fla', status: 'IN_DEVELOPMENT', featured: true,
    summary:     'Dicionário e tradutor Kriolu ↔ Português, com extensão para o Chrome.',
    description: 'Dicionário com as variantes de cada ilha, tradutor de frases e extensão de browser.',
    tags: ['React', 'API', 'Chrome Extension'], coverColor: '#F5F5F2', coverTextColor: '#5A3520', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: '[Papel no projeto]' }],
  },
  {
    id: 3, slug: '0district', name: '0district', shortName: '0d', status: 'CLIENT', featured: true,
    summary:     'Site para uma produtora: identidade, catálogo e contactos.',
    description: 'Site institucional com catálogo e formulário de contacto.',
    tags: ['React', 'CMS'], coverColor: '#1A1A1A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Design e desenvolvimento' }],
  },
  {
    id: 4, slug: 'toolkit-audio', name: 'Toolkit de áudio', shortName: 'Tk', status: 'COMING_SOON', featured: true,
    summary:     'Deteta BPM, tom e loudness no browser, em tempo real.',
    description: 'Ferramenta de análise de áudio feita com a Web Audio API.',
    tags: ['Web Audio API', 'React'], coverColor: '#3A3A3A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Processamento de áudio' }],
  },
  {
    id: 5, slug: 'ouril', name: 'Ouril', shortName: 'Ou', status: 'COMING_SOON', featured: true,
    summary:     'O jogo tradicional cabo-verdiano online, com IA e multijogador.',
    description: 'Jogo de tabuleiro no browser com adversário por IA e partidas em tempo real.',
    tags: ['React', 'WebSockets'], coverColor: '#8A5636', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Lógica do jogo, IA e animações' }],
  },
  {
    id: 6, slug: 'treino', name: 'Treino', shortName: 'Tr', status: 'COMING_SOON', featured: true,
    summary:     'App de treino e alimentação que funciona offline no telemóvel.',
    description: 'PWA com registo de treinos, refeições e gráficos de progresso.',
    tags: ['PWA', 'IndexedDB'], coverColor: '#D2D2D0', coverTextColor: '#0A0A0A', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Design e desenvolvimento' }],
  },
  {
    id: 7, slug: 'NhaGastu', name: 'NhaGastu', shortName: 'Ng', status: 'COMING_SOON', featured: true,
    summary:     'Gerenciamento dos teus gastos pessoais',
    description: 'Ferramenta de gestão feita com React e Spring Boot',
    tags: ['Spring Boot', 'React'], coverColor: '#3A3A3A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'miriam-pina', name: 'Miriam Pina', role: 'Fundadora, design e desenvolvimento' }],
  },
];

const _projectsEn = [
  {
    id: 1, slug: 'batuku', name: 'Batuku', shortName: 'Bk', status: 'IN_DEVELOPMENT', featured: true,
    summary:     'Discovery and monetisation for independent Cape Verdean artists.',
    description: 'Music platform with artist profiles, analytics, gamification and a beats marketplace.',
    tags: ['React', 'Spring Boot', 'MySQL'], coverColor: '#2A1D15', coverTextColor: '#A9714A', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Founder · full stack' }],
  },
  {
    id: 2, slug: 'fla', name: 'Fla', shortName: 'Fla', status: 'IN_DEVELOPMENT', featured: true,
    summary:     'Kriolu ↔ Portuguese dictionary and translator, with a Chrome extension.',
    description: 'Dictionary with each island\'s variants, a sentence translator and browser extension.',
    tags: ['React', 'API', 'Chrome Extension'], coverColor: '#F5F5F2', coverTextColor: '#5A3520', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: '[Role in the project]' }],
  },
  {
    id: 3, slug: '0district', name: '0district', shortName: '0d', status: 'CLIENT', featured: true,
    summary:     'Site for a production house: identity, catalogue and contacts.',
    description: 'Institutional site with catalogue and contact form.',
    tags: ['React', 'CMS'], coverColor: '#1A1A1A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Design and development' }],
  },
  {
    id: 4, slug: 'toolkit-audio', name: 'Audio Toolkit', shortName: 'Tk', status: 'COMING_SOON', featured: true,
    summary:     'Detects BPM, key and loudness in the browser, in real time.',
    description: 'Audio analysis tool built with the Web Audio API.',
    tags: ['Web Audio API', 'React'], coverColor: '#3A3A3A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Audio processing' }],
  },
  {
    id: 5, slug: 'ouril', name: 'Ouril', shortName: 'Ou', status: 'COMING_SOON', featured: true,
    summary:     'The traditional Cape Verdean board game online, with AI and multiplayer.',
    description: 'Browser board game with an AI opponent and real-time matches.',
    tags: ['React', 'WebSockets'], coverColor: '#8A5636', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Game logic, AI and animations' }],
  },
  {
    id: 6, slug: 'treino', name: 'Treino', shortName: 'Tr', status: 'COMING_SOON', featured: true,
    summary:     'Training and nutrition app that works offline on mobile.',
    description: 'PWA with workout logs, meals and progress charts.',
    tags: ['PWA', 'IndexedDB'], coverColor: '#D2D2D0', coverTextColor: '#0A0A0A', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Design and development' }],
  },
  {
    id: 7, slug: 'NhaGastu', name: 'NhaGastu', shortName: 'Ng', status: 'COMING_SOON', featured: true,
    summary:     'managemnt of your personal spents',
    description: 'Managemnt tool built with React and Spring Boot',
    tags: ['Spring Boot', 'React'], coverColor: '#3A3A3A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'miriam-pina', name: 'Miriam Pina', role: 'Founder, design and development' }],
  },
];

const _projectsKri = [
  {
    id: 1, slug: 'batuku', name: 'Batuku', shortName: 'Bk', status: 'IN_DEVELOPMENT', featured: true,
    summary:     'Deskubrimentu i monetizason pa artistas independentis kabuverdianus.',
    description: 'Plataforma di múzika ku perfils di artista, analytics, gamifikason i marketplace di beats.',
    tags: ['React', 'Spring Boot', 'MySQL'], coverColor: '#2A1D15', coverTextColor: '#A9714A', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Fundadór · full stack' }],
  },
  {
    id: 2, slug: 'fla', name: 'Fla', shortName: 'Fla', status: 'IN_DEVELOPMENT', featured: true,
    summary:     'Disionáriu i tradutór Kriolu ↔ Purtuges, ku extenson pa Chrome.',
    description: 'Disionáriu ku variantis di kada ilha, tradutór di frazis i extenson di browser.',
    tags: ['React', 'API', 'Chrome Extension'], coverColor: '#F5F5F2', coverTextColor: '#5A3520', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: '[Papél na prodjetu]' }],
  },
  {
    id: 3, slug: '0district', name: '0district', shortName: '0d', status: 'CLIENT', featured: true,
    summary:     'Site pa un produtóra: identidadi, katálogu i kontatus.',
    description: 'Site institusional ku katálogu i formuláriu di kontatu.',
    tags: ['React', 'CMS'], coverColor: '#1A1A1A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Design i dizinvulvimentu' }],
  },
  {
    id: 4, slug: 'toolkit-audio', name: 'Toolkit di áudiu', shortName: 'Tk', status: 'COMING_SOON', featured: true,
    summary:     'Detéta BPM, tom i loudness na browser, na tempu real.',
    description: 'Ferramentus di análizi di áudiu fetu ku Web Audio API.',
    tags: ['Web Audio API', 'React'], coverColor: '#3A3A3A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Prossesamentu di áudiu' }],
  },
  {
    id: 5, slug: 'ouril', name: 'Ouril', shortName: 'Ou', status: 'COMING_SOON', featured: true,
    summary:     'Djógu tradisional kabuverdianus online, ku IA i multijogadór.',
    description: 'Djógu di tabuleru na browser ku adversáriu IA i partidas na tempu real.',
    tags: ['React', 'WebSockets'], coverColor: '#8A5636', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Lógika di djógu, IA i animasons' }],
  },
  {
    id: 6, slug: 'trenu', name: 'Trenu', shortName: 'Tr', status: 'COMING_SOON', featured: true,
    summary:     'App di trenu i alimentason ki ta funciona offline na telemóvel.',
    description: 'PWA ku registru di trenus, refeisons i gráfikus di progresso.',
    tags: ['PWA', 'IndexedDB'], coverColor: '#D2D2D0', coverTextColor: '#0A0A0A', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'rafael-reis', name: 'Rafael Reis', role: 'Design i dizinvulvimentu' }],
  },
  {
    id: 7, slug: 'NhaGastu', name: 'NhaGastu', shortName: 'Ng', status: 'COMING_SOON', featured: true,
    summary:     'Gerenciamentu di bus gastus pessuais',
    description: 'Ferramenta di geston fetu ku React i Spring Boot',
    tags: ['Spring Boot', 'React'], coverColor: '#3A3A3A', coverTextColor: '#F5F5F2', coverImageUrl: null,
    liveUrl: null, repoUrl: null, year: 2026,
    team: [{ slug: 'miriam-pina', name: 'Miriam Pina', role: 'Fundadora, design e disenvolvimentu' }],
  },
];

export const projects = _projectsPt;
export function getProjects(lang) {
  if (lang === 'en')  return _projectsEn;
  if (lang === 'kri') return _projectsKri;
  return _projectsPt;
}

// ── Members ───────────────────────────────────────────────────────────

const _membersPt = [
  {
    id: 1, slug: 'rafael-reis', name: 'Rafael Reis', role: 'Fundador', founder: true, theme: 'PETROL',
    headline:     'FullStack developer e fundador da Badiu. Faço interfaces rápidas, acessíveis e com atenção ao detalhe.',
    shortBio:     'Frontend · Design de interfaces · Deploy',
    bio:          '[Um parágrafo teu: como chegaste à programação, o que te puxa no frontend e o que procuras a seguir.]',
    photoUrl: null, location: 'Santiago, CV → Portalegre, PT',
    availability: '[Disponibilidade: aberto a estágio e freelance]',
    links: { cv: null, portfolio: 'https://rafaelreis.dev', github: null, linkedin: null, email: 'rafael@badiudigital.com' },
    skills: [
      { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML / CSS'] },
      { group: 'Backend',  items: ['Spring Boot', 'Node.js', 'MySQL', 'MySql'] },
      { group: 'Sistemas', items: ['Linux (Debian)', 'Docker', 'Redes', 'Automação / PLC'] },
    ],
    timeline: [
      { period: '2026 · hoje', title: 'Fundador, Badiu Digital',          place: 'Design e desenvolvimento de produtos digitais.' },
      { period: '[ano] · hoje', title: 'Engenharia Informática',           place: 'ESTGD, Politécnico de Portalegre' },
      { period: '[ano]',        title: '[Experiência / estágio / certificação]', place: '[Descrição curta]' },
    ],
    projects: [
      { slug: 'BadiuDigital',           name: 'Badiu Digital, Software com raízes', shortName: 'Bd', role: 'Fundador · frontend, backend e base de dados',  tags: ['React', 'Spring Boot'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'batuku',        name: 'Batuku',              shortName: 'Bk',  role: 'Fundador · frontend, backend e base de dados',       tags: ['React', 'Spring Boot'], coverColor: '#2A1D15', coverTextColor: '#A9714A' },
      { slug: 'fla',           name: 'Fla, Dicionário Kriolu', shortName: 'Fla', role: '[O teu papel no projeto]',                      tags: ['React', 'Chrome Ext.'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: '0district',     name: '0district',           shortName: '0d',  role: 'Design e desenvolvimento do site',                  tags: ['React', 'CMS'],         coverColor: '#1A1A1A', coverTextColor: '#F5F5F2' },
      { slug: 'toolkit-audio', name: 'Toolkit de áudio',    shortName: 'Tk',  role: 'Processamento de áudio em tempo real no browser',   tags: ['Web Audio API'],        coverColor: '#3A3A3A', coverTextColor: '#F5F5F2' },
      { slug: 'ouril',         name: 'Ouril',               shortName: 'Ou',  role: 'Lógica do jogo, IA e animações',                    tags: ['React', 'WebSockets'],  coverColor: '#8A5636', coverTextColor: '#F5F5F2' },
    ],
  },
  {
    id: 2, slug: 'Miriam Pina', name: 'Miriam Pina', role: 'Co-Fundador', founder: false, theme: 'SAND',
    headline: '[Frase de apresentação]', shortBio: '[Áreas de especialidade]', bio: '[Bio]',
    photoUrl: null, location: '[Localização]',
    availability: '[Disponibilidade: aberto a estágio e freelance]',
    links: { cv: null, portfolio: null, github: null, linkedin: null, email: null },
    skills: [
      { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML / CSS'] },
      { group: 'Backend',  items: ['Spring Boot', 'Node.js', 'MySQL', 'MySql'] },
      { group: 'Sistémas', items: ['Linux (Debian)', 'Docker', 'Rédis', 'Automação / PLC'] },
    ],
    timeline: [
      { period: '2026 · hoje',   title: 'Co-Fundador, Badiu Digital',                  place: 'Design e desenvolvimento de produtos digitais.' },
      { period: '[ano] · hoje',  title: 'Engenharia Informática',                  place: 'ESTGD, Politécnico de Portalegre' },
      { period: '[ano]',        title: '[Experiências / estágio / certificações]',    place: '[Descrição curta]' },
    ],
    projects: [
      { slug: 'BadiuDigital',           name: 'Badiu Digital, Software com raízes', shortName: 'Bd', role: 'Co-Fundador · frontend, backend e base de dados',  tags: ['React', 'Spring Boot'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'fla',           name: 'Fla, Dicionário Kriolu', shortName: 'Fla', role: 'Co-Fundador · frontend, backend e base de dados',  tags: ['React', 'Chrome Ext.'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'NhaGastu', name: 'NhaGastu',    shortName: 'Ng',  role: 'Gerenciamento dos teus gastos pessoais',    tags: ['React, Spring Boot'],        coverColor: '#3A3A3A', coverTextColor: '#F5F5F2' },
    ],
  },
];

const _membersEn = [
  {
    id: 1, slug: 'rafael-reis', name: 'Rafael Reis', role: 'Founder', founder: true, theme: 'PETROL',
    headline:     'FullStack developer and founder of Badiu. I build fast, accessible interfaces with attention to detail.',
    shortBio:     'Frontend · Interface design · Deploy',
    bio:          '[Your paragraph: how you got into coding, what draws you to frontend and what you\'re looking for next.]',
    photoUrl: null, location: 'Santiago, CV → Portalegre, PT',
    availability: '[Availability: open to internship and freelance]',
    links: { cv: null, portfolio: 'https://rafaelreis.dev', github: null, linkedin: null, email: 'rafael@badiudigital.com' },
    skills: [
      { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML / CSS'] },
      { group: 'Backend',  items: ['Spring Boot', 'Node.js', 'MySQL', 'MySql'] },
      { group: 'Systems',  items: ['Linux (Debian)', 'Docker', 'Networking', 'Automation / PLC'] },
    ],
    timeline: [
      { period: '2026 · today', title: 'Founder, Badiu Digital',                  place: 'Design and development of digital products.' },
      { period: '[year] · today', title: 'Computer Engineering',                  place: 'ESTGD, Politécnico de Portalegre' },
      { period: '[year]',         title: '[Experience / internship / certification]', place: '[Short description]' },
    ],
    projects: [
      { slug: 'BadiuDigital',           name: 'Badiu Digital, Software with roots', shortName: 'Bd', role: 'Founder · frontend, backend and data base',  tags: ['React', 'Spring Boot'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'batuku',        name: 'Batuku',           shortName: 'Bk',  role: 'Founder · frontend, backend and database',          tags: ['React', 'Spring Boot'], coverColor: '#2A1D15', coverTextColor: '#A9714A' },
      { slug: 'fla',           name: 'Fla, Kriolu Dictionary', shortName: 'Fla', role: '[Your role in the project]',                  tags: ['React', 'Chrome Ext.'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: '0district',     name: '0district',        shortName: '0d',  role: 'Design and site development',                       tags: ['React', 'CMS'],         coverColor: '#1A1A1A', coverTextColor: '#F5F5F2' },
      { slug: 'toolkit-audio', name: 'Audio Toolkit',    shortName: 'Tk',  role: 'Real-time audio processing in the browser',         tags: ['Web Audio API'],        coverColor: '#3A3A3A', coverTextColor: '#F5F5F2' },
      { slug: 'ouril',         name: 'Ouril',            shortName: 'Ou',  role: 'Game logic, AI and animations',                     tags: ['React', 'WebSockets'],  coverColor: '#8A5636', coverTextColor: '#F5F5F2' },
    ],
  },
  {
    id: 2, slug: 'Miriam Pina', name: 'Miriam Pina', role: 'Co-Founder', founder: false, theme: 'SAND',
    headline: '[Tagline]', shortBio: '[Areas of expertise]', bio: '[Bio]',
    photoUrl: null, location: '[Location]',
    availability: '[Availability: open to internship and freelance]',
    links: { cv: null, portfolio: null, github: null, linkedin: null, email: null },
    skills: [
      { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML / CSS'] },
      { group: 'Backend',  items: ['Spring Boot', 'Node.js', 'MySQL', 'MySql'] },
      { group: 'Systems',  items: ['Linux (Debian)', 'Docker', 'Networking', 'Automation / PLC'] },
    ],
    timeline: [
      { period: '2026 · today', title: 'Co-Founder, Badiu Digital',                  place: 'Design and development of digital products.' },
      { period: '[year] · today', title: 'Computer Engineering',                  place: 'ESTGD, Politécnico de Portalegre' },
      { period: '[year]',         title: '[Experience / internship / certification]', place: '[Short description]' },
    ],
    projects: [
      { slug: 'BadiuDigital',           name: 'Badiu Digital, Software with roots', shortName: 'Bd', role: 'Co-Founder · frontend, backend and data base',  tags: ['React', 'Spring Boot'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'fla',           name: 'Fla, Disionáriu Kriolu', shortName: 'Fla', role: 'Co-Founder · frontend, backend and data base',  tags: ['React', 'Chrome Ext.'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'NhaGastu', name: 'NhaGastu',    shortName: 'Ng',  role: 'Managemnts of your personal spent',    tags: ['React, Spring Boot'],        coverColor: '#3A3A3A', coverTextColor: '#F5F5F2' },
    ],
  },
];

const _membersKri = [
  {
    id: 1, slug: 'rafael-reis', name: 'Rafael Reis', role: 'Fundador', founder: true, theme: 'PETROL',
    headline:     'Dizenvolvidor fullStack i fundadór di Badiu. Nta fazi interfasis rápidos, assesíveis i ku atenson pa detalhis.',
    shortBio:     'Frontend · Design di interfasis · Deploy',
    bio:          '[Un parágraf bo: kómu bo txegá pa programason, nhu ki ta pudjá bo na frontend i nhu ki bo ta porsurá pa dianti.]',
    photoUrl: null, location: 'Santiagu, KV → Portalegri, PT',
    availability: '[Disponibilidadi: abertu pa estágio i freelances]',
    links: { cv: null, portfolio: 'https://rafaelreis.dev', github: null, linkedin: null, email: 'rafael@badiudigital.com' },
    skills: [
      { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML / CSS'] },
      { group: 'Backend',  items: ['Spring Boot', 'Node.js', 'MySQL', 'MySql'] },
      { group: 'Sistémas', items: ['Linux (Debian)', 'Docker', 'Rédis', 'Automatizason / PLC'] },
    ],
    timeline: [
      { period: '2026 · hoji',   title: 'Fundadór, Badiu Digital',                  place: 'Desgin i dizinvulvimentu di produtus digitais.' },
      { period: '[anu] · hoji',  title: 'Engenharia Informátika',                  place: 'ESTGD, Politécnico de Portalegre' },
      { period: '[anu]',        title: '[Experiénsias / estágio / sertifikason]',    place: '[Diskirison kurtu]' },
    ],
    projects: [
      { slug: 'BadiuDigital',           name: 'Badiu Digital, Software ku raízes', shortName: 'Bd', role: 'Fundadór · frontend, backend i bazi di dadus',  tags: ['React', 'Spring Boot'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'batuku',        name: 'Batuku',              shortName: 'Bk',  role: 'Fundadór · frontend, backend i bazi di dadus',      tags: ['React', 'Spring Boot'], coverColor: '#2A1D15', coverTextColor: '#A9714A' },
      { slug: 'fla',           name: 'Fla, Disionáriu Kriolu', shortName: 'Fla', role: 'Fundadór · frontend, backend i bazi di dadus',                         tags: ['React', 'Chrome Ext.'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: '0district',     name: '0district',           shortName: '0d',  role: 'Design i dizinvulvimentu di site',                  tags: ['React', 'CMS'],         coverColor: '#1A1A1A', coverTextColor: '#F5F5F2' },
      { slug: 'toolkit-audio', name: 'Toolkit di áudiu',    shortName: 'Tk',  role: 'Prossesamentu di áudiu na tempu real na browser',    tags: ['Web Audio API'],        coverColor: '#3A3A3A', coverTextColor: '#F5F5F2' },
      { slug: 'ouril',         name: 'Ouril',               shortName: 'Ou',  role: 'Lógka di djógu, IA i animasons',                 tags: ['React', 'WebSockets'],  coverColor: '#8A5636', coverTextColor: '#F5F5F2' },
    ],
  },
  {
    id: 2, slug: 'Miriam Pina', name: 'Miriam Pina', role: 'Co-Fundador', founder: false, theme: 'SAND',
    headline: '[Frazi di aprizentason]', shortBio: '[Áreas di spesialidas]', bio: '[Bio]',
    photoUrl: null, location: '[Lokalizason]',
    availability: '[Disponibilidadi: abertu pa estágio i freelances]',
    links: { cv: null, portfolio: null, github: null, linkedin: null, email: null },
    skills: [
      { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML / CSS'] },
      { group: 'Backend',  items: ['Spring Boot', 'Node.js', 'MySQL', 'MySql'] },
      { group: 'Sistémas', items: ['Linux (Debian)', 'Docker', 'Rédis', 'Automatizason / PLC'] },
    ],
    timeline: [
      { period: '2026 · hoji',   title: 'Co-Fundadór, Badiu Digital',                  place: 'Design i dizinvulvimentu di produtus digitais.' },
      { period: '[anu] · hoji',  title: 'Engenharia Informátika',                  place: 'ESTGD, Politécnico de Portalegre' },
      { period: '[anu]',        title: '[Experiénsias / estágio / sertifikason]',    place: '[Diskirison kurtu]' },
    ],
    projects: [
      { slug: 'BadiuDigital',           name: 'Badiu Digital, Software ku raízes', shortName: 'Bd', role: 'Co-Fundador · frontend, backend i bazi di dadus',  tags: ['React', 'Spring Boot'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'fla',           name: 'Fla, Disionáriu Kriolu', shortName: 'Fla', role: 'Co-Fundador · frontend, backend i bazi di dadus',  tags: ['React', 'Chrome Ext.'], coverColor: '#F5F5F2', coverTextColor: '#5A3520' },
      { slug: 'NhaGastu', name: 'NhaGastu',    shortName: 'Ng',  role: 'Gerenciamentu de bus gastus pessual',    tags: ['React, Spring Boot'],        coverColor: '#3A3A3A', coverTextColor: '#F5F5F2' },
    ],
  },
];

export const members = _membersPt;
export function getMembers(lang) {
  if (lang === 'en')  return _membersEn;
  if (lang === 'kri') return _membersKri;
  return _membersPt;
}
