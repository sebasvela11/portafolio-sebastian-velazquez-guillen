// --- Utilidades
const qs  = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

// --- Navegación suave
qsa('nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = qs(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

// --- Modal
const modal = qs('#modal');
const modalContent = modal?.querySelector('.modal-content');
const btnClose = modal?.querySelector('.modal-close');

function openModalWithImage(src, alt='') {
  if (!modal || !modalContent) return;
  modalContent.innerHTML = `<img src="${src}" alt="${alt}">`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}
function openModalWithPDF(src) {
  if (!modal || !modalContent) return;
  modalContent.innerHTML = `<iframe src="${src}" title="Documento PDF"></iframe>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}
function closeModal() {
  if (!modal || !modalContent) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); modalContent.innerHTML = '';
}
btnClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Delegación modal
document.addEventListener('click', e => {
  const t = e.target.closest?.('[data-modal]');
  if (!t) return;
  const type = t.getAttribute('data-modal');
  const src = t.getAttribute('data-src') || t.querySelector('img')?.getAttribute('src') || '';
  if (!src) return;
  if (type === 'img') openModalWithImage(src, t.querySelector('img')?.alt || '');
  if (type === 'pdf') openModalWithPDF(src);
});

// --- Aparición con IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('in-view');
      if (el.hasAttribute('data-reveal-group')) el.classList.add('group-in');
      el.querySelectorAll('[data-reveal-stagger]').forEach(s => s.classList.add('stagger-in'));
    } else {
      el.classList.remove('in-view', 'group-in');
      el.querySelectorAll('[data-reveal-stagger]').forEach(s => s.classList.remove('stagger-in'));
    }
  });
}, { rootMargin: "0px 0px -10% 0px", threshold: 0.18 });
qsa('.reveal').forEach(el => io.observe(el));

/* =========================
   I18N (sin tema)
   ========================= */

// Diccionario EN (ES se toma del DOM inicial mediante snapshot)
const translations = {
  en: {
    doc_title: "Portfolio | Sebastián Velázquez Guillén",
    role: "Software Developer · San José, Costa Rica",
    nav_info: "About Me",
    nav_formacion: "Education",
    nav_experiencia: "Experience",
    nav_proyectos: "Projects",
    nav_cartas: "Letters",

    info_title: "About Me",
    info_text: "Software developer with strong adaptability, problem-solving skills, and a focus on delivering outstanding results both independently and in teams.",
    email_label: "Email:",
    phone: "Phone:",
    languages: "Languages:",

    skills_pro: "Professional Skills",
    skills_soft: "Soft Skills",
    pro_modelado: "Data Modeling",
    pro_arch_backend: "Backend Architecture",
    pro_arch_frontend: "Frontend Architecture",
    pro_user_centered: "User-centered Design",

    form_title: "Education",
    form_edu: "Software Engineering",
    form_uni: "Universidad Latina de Costa Rica",
    form_cert: "Certifications",

    exp_title: "Experience",
    exp_role: "Intern – Digital Product Developer",
    exp_dates: "January 2023 – November 2023",
    exp_1: "Identified and designed solutions to improve application usability.",
    exp_2: "Detected and fixed functionality issues to ensure optimal performance.",
    exp_3: "Designed and developed data models to support applications.",
    exp_4: "Contributed to backend with robust, scalable architecture.",
    exp_5: "Designed and programmed frontend features focused on UX.",
    exp_6: "Performed thorough testing of mobile and web apps.",
    exp_7: "Participated in building mobile and web apps to industry standards.",
    exp_8: "Managed relational and non-relational databases.",

    proj_title: "Projects",
    proj_text1: "Checkpoint is a platform made by gamers for gamers. It offers reviews, guides, and analysis from an authentic, community-first perspective.",
    proj_text2: "Content is produced by selected authors and integrated into an AI assistant that interprets it to deliver useful recommendations and personalized insights.",
    proj_text3: "Built with a Node.js backend and SQL Server, with a scalable architecture and semantic retrieval for context-aware search.",

    letters_title: "Recommendation Letters",
    letter_cci_title: "Recommendation Letter – CCI Consultores",
    letter_hillary_title: "Recommendation Letter – Eng. Hillary Sánchez",
    open_new_tab: "Open in new tab",
    view_here: "View here",

    cert_bach: "High School Diploma",
    cert_bach_meta: "Colegio Madre del Divino Pastor · 2021",
    cert_info: "Certificate of Achievement – Computer Science",
    cert_info_meta: "Colegio Madre del Divino Pastor · 2021",
    cert_b1: "English Level B1",
    cert_b1_meta: "UCR / MEP · 2021",
    cert_b2b: "B2B Sales Course",
    cert_js_total: "JavaScript TOTAL",
    cert_reco: "Recognition – Development & Management of Programmable Project",
    cert_reco_meta: "Eng. Hillary Sánchez Noguera · 2023",

    // Soft skills
    soft_problem_solving: "Problem Solving",
    soft_adaptability: "Adaptability",
    soft_responsibility: "Responsibility",
    soft_leadership: "Leadership",
    soft_empathy: "Empathy",
    soft_communication: "Communication",
    soft_teamwork: "Teamwork",
    soft_results: "Results Orientation",
    soft_self: "Self-management"
  },
  es: {} // Se poblará con snapshot del DOM inicial
};

// Snapshot ES desde el DOM inicial
const esSnapshot = {};
function captureSpanishSnapshot() {
  qsa('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && !(key in esSnapshot)) {
      esSnapshot[key] = (el.textContent ?? '').trim();
    }
  });
  translations.es = { ...esSnapshot, ...translations.es };
}

// Aplicar idioma
function applyLanguage(lang) {
  const dict = translations[lang] || {};
  qsa('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (typeof value === 'string') {
      el.textContent = value;
    } else if (lang === 'es' && typeof translations.es[key] === 'string') {
      el.textContent = translations.es[key];
    }
  });

  // <title>
  const titleEl = document.querySelector('title[data-i18n="doc_title"]');
  if (titleEl) {
    const t = dict.doc_title || translations.es.doc_title || titleEl.textContent;
    titleEl.textContent = t;
  }

  document.documentElement.lang = lang;
  localStorage.setItem('pref-lang', lang);

  qs('#lang-es')?.classList.toggle('active', lang === 'es');
  qs('#lang-en')?.classList.toggle('active', lang === 'en');
}

// Eventos de idioma
qs('#lang-es')?.addEventListener('click', () => applyLanguage('es'));
qs('#lang-en')?.addEventListener('click', () => applyLanguage('en'));

// Boot: snapshot ES, luego aplicar idioma guardado
(function boot() {
  captureSpanishSnapshot();
  const savedLang = localStorage.getItem('pref-lang') || (navigator.language?.startsWith('en') ? 'en' : 'es');
  applyLanguage(savedLang);
})();