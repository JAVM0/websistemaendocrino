/* ============================================
  EndoAcademia - Script Principal
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSearch();
  initVideoPlayer();
  initForum();
  initAnimations();
});

/* --- NAVBAR --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__menu-btn');
  const nav = document.querySelector('.navbar__nav');
  const links = document.querySelectorAll('.navbar__link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  toggle?.addEventListener('click', () => nav.classList.toggle('open'));

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      nav.classList.remove('open');
    });
  });
}

/* --- SEARCH --- */
function initSearch() {
  const openBtn = document.querySelector('.navbar__search-btn');
  const bar = document.querySelector('.search-bar');
  const closeBtn = bar?.querySelector('.search-bar__close');
  const input = bar?.querySelector('input');
  const modal = document.querySelector('.modal-overlay');
  const modalClose = modal?.querySelector('.modal__close');
  const resultsList = modal?.querySelector('.modal__body');

  const docs = [
    { title: 'U2 - Lectura 1: Glándulas', type: 'PDF', icon: 'description', file: 'assets/U2_Lectura1.pdf' },
    { title: 'Sistema Endocrino', type: 'PDF', icon: 'description', file: 'assets/Sistema endocrino.pdf' },
    { title: 'Contenido del Módulo', type: 'PDF', icon: 'description', file: 'assets/content.pdf' },
    { title: 'Patología Endocrina', type: 'PDF', icon: 'description', file: 'assets/Patologia Endocrina.pdf' },
    { title: 'Feocromocitoma', type: 'PDF', icon: 'description', file: 'assets/feocromocitoma.pdf' },
    { title: 'Endocrinología Clínica', type: 'PDF', icon: 'description', file: 'assets/Endocrinología.pdf' },
    { title: 'Video: Hormonas', type: 'Video', icon: 'smart_display', file: 'assets/videoplayback.mp4' },
  ];

  openBtn?.addEventListener('click', () => {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) input?.focus();
  });

  closeBtn?.addEventListener('click', () => {
    bar.classList.remove('open');
    input.value = '';
  });

  input?.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { modal.classList.remove('open'); return; }
    const filtered = docs.filter(d => d.title.toLowerCase().includes(q));
    resultsList.innerHTML = filtered.length
      ? filtered.map(d => `
        <a href="${d.file}" target="_blank" class="search-result">
          <div class="search-result__title">${d.title}</div>
          <div class="search-result__type">${d.type}</div>
        </a>`).join('')
      : '<div class="modal__empty">No se encontraron resultados.</div>';
    modal.classList.add('open');
  });

  modalClose?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

/* --- VIDEO PLAYER --- */
function initVideoPlayer() {
  const video = document.querySelector('.video-native__player');
  if (!video) return;

  video.currentTime = 20;

  const playBtn = document.querySelector('#videoPlayBtn');
  const playIcon = playBtn?.querySelector('.material-symbols-outlined');
  const seek = document.querySelector('.video-native__seek');
  const volume = document.querySelector('.video-native__volume');
  const timeDisplay = document.querySelector('.video-native__time');
  const volBtn = document.querySelector('#videoMuteBtn');
  const volIcon = volBtn?.querySelector('.material-symbols-outlined');
  const fsBtn = document.querySelector('#videoFullscreenBtn');
  const wrapper = document.querySelector('.video-native');

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updateTime() {
    const cur = video.currentTime;
    const dur = video.duration || 1;
    seek.value = (cur / dur) * 100;
    timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
  }

  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('timeupdate', updateTime);

  video.addEventListener('play', () => {
    if (playIcon) playIcon.textContent = 'pause';
  });
  video.addEventListener('pause', () => {
    if (playIcon) playIcon.textContent = 'play_arrow';
  });

  playBtn?.addEventListener('click', () => {
    video.paused ? video.play() : video.pause();
  });

  seek?.addEventListener('input', () => {
    video.currentTime = (seek.value / 100) * video.duration;
  });

  volume?.addEventListener('input', () => {
    video.volume = parseFloat(volume.value);
  });

  volBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
    if (volIcon) volIcon.textContent = video.muted ? 'volume_off' : 'volume_up';
  });

  fsBtn?.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
  });

  video.addEventListener('ended', () => {
    if (playIcon) playIcon.textContent = 'replay';
  });
}

/* --- FORO --- */
function initForum() {
  const data = getForumData();
  const threadsList = document.querySelector('.forum__threads');
  const newThreadForm = document.querySelector('#newThreadForm');
  const toggleBtn = document.querySelector('#newDiscussionBtn');
  const cancelBtn = document.querySelector('#cancelThreadBtn');
  const submitBtn = document.querySelector('#submitThreadBtn');

  renderThreads(data, threadsList);

  toggleBtn?.addEventListener('click', () => {
    const isOpen = newThreadForm.style.display !== 'none';
    newThreadForm.style.display = isOpen ? 'none' : 'flex';
    toggleBtn.querySelector('.material-symbols-outlined').textContent = isOpen ? 'add' : 'close';
  });

  cancelBtn?.addEventListener('click', () => {
    newThreadForm.style.display = 'none';
    newThreadForm.reset();
    toggleBtn.querySelector('.material-symbols-outlined').textContent = 'add';
  });

  submitBtn?.addEventListener('click', e => {
    e.preventDefault();
    const title = document.querySelector('#newThreadTitle').value.trim();
    const body = document.querySelector('#newThreadBody').value.trim();
    const tag = document.querySelector('#newThreadTag').value;
    const author = document.querySelector('#newThreadAuthor').value.trim() || 'Anónimo';
    if (!title || !body) return;
    data.unshift({
      id: Date.now(),
      title,
      author,
      time: 'Ahora',
      tag,
      replies: 0,
      votes: 0,
      comments: [{ author, text: body, time: 'Ahora' }]
    });
    renderThreads(data, threadsList);
    newThreadForm.reset();
    newThreadForm.style.display = 'none';
    toggleBtn.querySelector('.material-symbols-outlined').textContent = 'add';
  });

  threadsList?.addEventListener('click', e => {
    const threadEl = e.target.closest('.thread');
    if (!threadEl) return;
    const id = parseInt(threadEl.dataset.id);
    const thread = data.find(t => t.id === id);
    if (!thread) return;

    if (e.target.closest('.thread__vote-icon')) {
      const isUp = e.target.textContent.trim() === 'arrow_upward';
      thread.votes += isUp ? 1 : -1;
      threadEl.querySelector('.thread__vote-count').textContent = thread.votes;
      return;
    }

    if (e.target.closest('.thread__expand-btn')) {
      toggleComments(threadEl, thread, data, threadsList);
      return;
    }

    toggleComments(threadEl, thread, data, threadsList);
  });
}

function toggleComments(threadEl, thread, data, threadsList) {
  const existing = threadEl.nextElementSibling;
  if (existing?.classList.contains('comments-panel')) {
    existing.remove();
    threadEl.querySelector('.thread__expand-btn')?.classList.remove('active');
    return;
  }

  document.querySelectorAll('.comments-panel').forEach(p => p.remove());
  document.querySelectorAll('.thread__expand-btn.active').forEach(b => b.classList.remove('active'));

  const panel = document.createElement('div');
  panel.className = 'comments-panel';
  panel.innerHTML = `
    <div class="comments-panel__list">
      ${(thread.comments || []).map(c => `
        <div class="comment">
          <div class="comment__avatar${c.author !== thread.author ? ' comment__avatar--alt' : ''}">
            ${c.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div class="comment__body">
            <div class="comment__header">
              <span class="comment__author">${c.author}</span>
              <span class="comment__time">${c.time}</span>
            </div>
            <div class="comment__text">${c.text}</div>
          </div>
        </div>`).join('')}
    </div>
    <form class="comments-panel__form">
      <input type="text" class="comments-panel__author-input" placeholder="Tu nombre (opcional)">
      <textarea class="comments-panel__input" placeholder="Escribe tu comentario..." rows="2"></textarea>
      <button type="submit" class="btn btn--primary btn--sm">Comentar</button>
    </form>`;

  threadEl.after(panel);
  threadEl.querySelector('.thread__expand-btn')?.classList.add('active');

  panel.querySelector('form')?.addEventListener('submit', e => {
    e.preventDefault();
    const authorInput = panel.querySelector('.comments-panel__author-input');
    const textarea = panel.querySelector('.comments-panel__input');
    const text = textarea?.value.trim();
    if (!text) return;
    const author = authorInput?.value.trim() || 'Anónimo';
    thread.comments.push({ author, text, time: 'Ahora' });
    thread.replies = thread.comments.length;
    renderThreads(data, threadsList);
  });
}

function renderThreads(data, container) {
  container.innerHTML = data.map(t => `
    <div class="thread" data-id="${t.id}">
      <div class="thread__votes">
        <span class="thread__vote-icon material-symbols-outlined">arrow_upward</span>
        <span class="thread__vote-count">${t.votes}</span>
        <span class="thread__vote-icon material-symbols-outlined">arrow_downward</span>
      </div>
      <div class="thread__content">
        <div class="thread__title">${t.title}</div>
        <div class="thread__meta">
          <span class="thread__tag thread__tag--${t.tag}">${t.tag === 'case' ? 'Caso Clínico' : t.tag === 'inquiry' ? 'Consulta' : 'Revisión'}</span>
          <span>${t.author} · ${t.time}</span>
          <span class="thread__replies">
            <span class="material-symbols-outlined">chat_bubble</span>
            ${t.replies} ${(t.replies === 1) ? 'respuesta' : 'respuestas'}
          </span>
        </div>
      </div>
      <button class="thread__expand-btn" data-action="toggle-comments">
        <span class="material-symbols-outlined">expand_more</span>
      </button>
    </div>`).join('');
}

function scrollToSection(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getForumData() {
  return [
    {
      id: 1,
      title: 'Caso clínico: Paciente con fatiga crónica y peso inexplicable',
      author: 'Dra. Ana Pérez',
      time: 'Hace 2 horas',
      tag: 'case',
      replies: 3,
      votes: 5,
      comments: [
        { author: 'Dra. Ana Pérez', text: 'Paciente femenina de 35 años presenta fatiga persistente, aumento de peso (5 kg en 3 meses) y piel seca. TSH elevada (8.2 mUI/L). ¿Diagnóstico y manejo inicial?', time: 'Hace 2 horas' },
        { author: 'Carlos López', text: 'Sugiero hipotiroidismo subclínico. Iniciar levotiroxina 50 mcg/día y reevaluar TSH en 6-8 semanas.', time: 'Hace 1 hora' },
        { author: 'María García', text: 'Coincido con Carlos. Además descartar anticuerpos anti-TPO para confirmar enfermedad de Hashimoto.', time: 'Hace 45 minutos' }
      ]
    },
    {
      id: 2,
      title: '¿Cuál es el papel de la vasopresina en el síndrome de secreción inapropiada?',
      author: 'Roberto Sánchez',
      time: 'Hace 1 día',
      tag: 'inquiry',
      replies: 2,
      votes: 8,
      comments: [
        { author: 'Roberto Sánchez', text: '¿Alguien puede explicar el mecanismo fisiopatológico exacto de la hiponatremia en el SIADH? No me queda claro el rol de la ADH.', time: 'Hace 1 día' },
        { author: 'Dra. Ana Pérez', text: 'La ADH (vasopresina) se libera de forma autónoma, causando reabsorción excesiva de agua en los túbulos colectores. Esto diluye el sodio sérico sin retención real de volumen.', time: 'Hace 20 horas' }
      ]
    },
    {
      id: 3,
      title: 'Repaso: Regulación del calcio por hormonas paratiroideas',
      author: 'María García',
      time: 'Hace 3 días',
      tag: 'review',
      replies: 1,
      votes: 12,
      comments: [
        { author: 'María García', text: 'Resumen: PTH aumenta calcio sérico estimulando reabsorción ósea, activación renal de vitamina D y reabsorción tubular de Ca²+. Su liberación está regulada por receptores sensores de Ca²+ en la glándula paratiroides.', time: 'Hace 3 días' },
        { author: 'Carlos López', text: 'Excelente resumen. Para el examen: recordar que la hipocalcemia estimula PTH y la hipercalcemia la suprime. El calcitriol también tiene负 feedback sobre PTH.', time: 'Hace 2 días' }
      ]
    }
  ];
}

/* --- ANIMACIONES --- */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.module-card, .doc-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
