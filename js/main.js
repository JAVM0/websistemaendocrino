/* ============================================
   EndoAcademia - Interacciones JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll shadow ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // --- Smooth scroll for nav links ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('navMenu').classList.remove('open');
            }
        });
    });

    // --- Mobile menu toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('.material-symbols-outlined');
        icon.textContent = navMenu.classList.contains('open') ? 'close' : 'menu';
    });

    // --- Search bar toggle ---
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('open');
        if (searchBar.classList.contains('open')) {
            searchInput.focus();
        }
    });

    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('open');
        searchInput.value = '';
    });

    // --- Search functionality ---
    const searchData = [
        { title: 'Trastornos de la Tiroides', type: 'Modulo', section: '#modulos' },
        { title: 'Corteza Suprarrenal', type: 'Modulo', section: '#modulos' },
        { title: 'Hueso Metabolico', type: 'Modulo', section: '#modulos' },
        { title: 'Video Educativo - Sistema Endocrino', type: 'Multimedia', section: '#multimedia' },
        { title: 'U2 - Lectura 1', type: 'Documento PDF', section: '#recursos' },
        { title: 'Sistema Endocrino', type: 'Documento PDF', section: '#recursos' },
        { title: 'Contenido Endocrino', type: 'Documento PDF', section: '#recursos' },
        { title: 'Patologia Endocrina', type: 'Documento PDF', section: '#recursos' },
        { title: 'Feocromocitoma', type: 'Documento PDF', section: '#recursos' },
        { title: 'Endocrinologia', type: 'Documento PDF', section: '#recursos' },
        { title: 'Hipocalcemia refractaria tras tiroidectomia', type: 'Foro', section: '#comunidad' },
        { title: 'Niveles discordantes de PTH y Calcio', type: 'Foro', section: '#comunidad' },
        { title: 'Inhibidores SGLT2 y beneficios cardiovasculares', type: 'Foro', section: '#comunidad' },
    ];

    const searchResults = document.getElementById('searchResults');
    const searchModal = document.getElementById('searchModal');
    const modalClose = document.getElementById('modalClose');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.innerHTML = '<p class="modal__empty">Escribe para buscar en modulos, documentos y discusiones...</p>';
            return;
        }

        const results = searchData.filter(item =>
            item.title.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="modal__empty">No se encontraron resultados para "' + query + '"</p>';
        } else {
            searchResults.innerHTML = results.map(item => `
                <div class="search-result" data-section="${item.section}">
                    <div class="search-result__title">${highlightMatch(item.title, query)}</div>
                    <div class="search-result__type">${item.type}</div>
                </div>
            `).join('');

            searchResults.querySelectorAll('.search-result').forEach(result => {
                result.addEventListener('click', () => {
                    const section = result.getAttribute('data-section');
                    const target = document.querySelector(section);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                    searchBar.classList.remove('open');
                    searchInput.value = '';
                });
            });
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchModal.classList.add('open');
        }
    });

    modalClose.addEventListener('click', () => {
        searchModal.classList.remove('open');
    });

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('open');
        }
    });

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong style="color:var(--primary)">$1</strong>');
    }

    // ============================================
    // VIDEO PLAYER NATIVO
    // ============================================
    const video = document.getElementById('mainVideo');
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoSeek = document.getElementById('videoSeek');
    const videoTime = document.getElementById('videoTime');
    const videoMuteBtn = document.getElementById('videoMuteBtn');
    const videoVolume = document.getElementById('videoVolume');
    const videoFullscreenBtn = document.getElementById('videoFullscreenBtn');

    if (video) {
        // Format time as M:SS or H:MM:SS
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            if (h > 0) {
                return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }
            return `${m}:${String(s).padStart(2, '0')}`;
        }

        // Start at 20 seconds when metadata loads
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = 20;
            videoSeek.max = video.duration;
            videoTime.textContent = `0:20 / ${formatTime(video.duration)}`;
        });

        // Play / Pause
        videoPlayBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                videoPlayBtn.querySelector('.material-symbols-outlined').textContent = 'pause';
            } else {
                video.pause();
                videoPlayBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
            }
        });

        // Also allow clicking the video itself to play/pause
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                videoPlayBtn.querySelector('.material-symbols-outlined').textContent = 'pause';
            } else {
                video.pause();
                videoPlayBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
            }
        });

        // Update time display and seek bar
        video.addEventListener('timeupdate', () => {
            if (!video.seeking) {
                videoSeek.value = video.currentTime;
                videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            }
        });

        // When video ends, reset icon
        video.addEventListener('ended', () => {
            videoPlayBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
        });

        // Seek bar input
        videoSeek.addEventListener('input', () => {
            video.currentTime = videoSeek.value;
        });

        // Mute toggle
        videoMuteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            videoMuteBtn.querySelector('.material-symbols-outlined').textContent =
                video.muted ? 'volume_off' : 'volume_up';
            if (video.muted) {
                videoVolume.value = 0;
            } else {
                videoVolume.value = video.volume;
            }
        });

        // Volume slider
        videoVolume.addEventListener('input', () => {
            video.volume = videoVolume.value;
            video.muted = video.volume === 0;
            videoMuteBtn.querySelector('.material-symbols-outlined').textContent =
                video.muted ? 'volume_off' : (video.volume < 0.5 ? 'volume_down' : 'volume_up');
        });

        // Fullscreen
        videoFullscreenBtn.addEventListener('click', () => {
            const container = video.parentElement;
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            }
        });

        // Update fullscreen icon state
        document.addEventListener('fullscreenchange', () => {
            videoFullscreenBtn.querySelector('.material-symbols-outlined').textContent =
                document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
        });

        // Keyboard shortcuts when video is focused or hovered
        video.parentElement.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    videoPlayBtn.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration, video.currentTime + 5);
                    break;
                case 'f':
                    e.preventDefault();
                    videoFullscreenBtn.click();
                    break;
                case 'm':
                    e.preventDefault();
                    videoMuteBtn.click();
                    break;
            }
        });
    }

    // ============================================
    // ANIMATE PROGRESS BARS ON SCROLL
    // ============================================
    const observerOptions = { threshold: 0.3 };
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.progress-bar__fill');
                fills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.modules-grid').forEach(grid => {
        progressObserver.observe(grid);
    });

    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: 0;
                height: 0;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
                transform: translate(-50%, -50%);
                animation: ripple 0.5s ease-out;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
    });

    // Inject animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { width: 200px; height: 200px; opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // FORO ACADEMICO FUNCIONAL
    // ============================================
    let threadIdCounter = 4;

    // --- Abrir/cerrar comentarios ---
    document.querySelectorAll('.thread__expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const thread = btn.closest('.thread');
            const id = thread.getAttribute('data-id');
            const panel = document.getElementById(`comments-${id}`);

            if (panel) {
                const isVisible = panel.style.display !== 'none';
                // Cerrar todos los paneles abiertos
                document.querySelectorAll('.comments-panel').forEach(p => p.style.display = 'none');
                document.querySelectorAll('.thread__expand-btn').forEach(b => b.classList.remove('active'));

                if (!isVisible) {
                    panel.style.display = 'block';
                    btn.classList.add('active');
                }
            }
        });
    });

    // --- Click en el hilo tambien abre/cierra comentarios ---
    document.querySelectorAll('.thread__content').forEach(content => {
        content.addEventListener('click', () => {
            const thread = content.closest('.thread');
            const btn = thread.querySelector('.thread__expand-btn');
            if (btn) btn.click();
        });
    });

    // --- Votos ---
    document.querySelectorAll('.thread__vote-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const countEl = icon.nextElementSibling;
            let count = parseInt(countEl.textContent);

            if (icon.classList.contains('voted')) {
                icon.classList.remove('voted');
                icon.style.color = '';
                icon.style.fontVariationSettings = "'FILL' 0";
                count--;
            } else {
                icon.classList.add('voted');
                icon.style.color = 'var(--primary)';
                icon.style.fontVariationSettings = "'FILL' 1";
                count++;
            }
            countEl.textContent = count;
        });
    });

    // --- Comentar en hilos existentes ---
    document.querySelectorAll('.comments-panel__submit').forEach(btn => {
        btn.addEventListener('click', () => {
            const threadId = btn.getAttribute('data-thread');
            const panel = document.getElementById(`comments-${threadId}`);
            const list = document.getElementById(`comments-list-${threadId}`);
            const input = panel.querySelector('.comments-panel__input');
            const authorInput = panel.querySelector('.comments-panel__author-input');
            const text = input.value.trim();
            const author = authorInput.value.trim() || 'Anónimo';

            if (!text) {
                input.style.borderColor = 'var(--error)';
                setTimeout(() => input.style.borderColor = '', 1500);
                return;
            }

            const initials = author.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            const isAlt = list.children.length % 2 !== 0;

            const commentHTML = `
                <div class="comment" style="animation: fadeIn 0.3s ease;">
                    <div class="comment__avatar ${isAlt ? 'comment__avatar--alt' : ''}">${initials}</div>
                    <div class="comment__body">
                        <div class="comment__header">
                            <span class="comment__author">${escapeHTML(author)}</span>
                            <span class="comment__time">Ahora mismo</span>
                        </div>
                        <p class="comment__text">${escapeHTML(text)}</p>
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', commentHTML);
            input.value = '';

            // Actualizar contador de respuestas
            const thread = document.querySelector(`.thread[data-id="${threadId}"]`);
            const replyCount = thread.querySelector('.thread__reply-count');
            if (replyCount) {
                replyCount.textContent = parseInt(replyCount.textContent) + 1;
            }
        });
    });

    // --- Nueva discusión ---
    const newDiscussionBtn = document.getElementById('newDiscussionBtn');
    const newThreadForm = document.getElementById('newThreadForm');
    const cancelThreadBtn = document.getElementById('cancelThreadBtn');
    const submitThreadBtn = document.getElementById('submitThreadBtn');

    if (newDiscussionBtn) {
        newDiscussionBtn.addEventListener('click', () => {
            const isVisible = newThreadForm.style.display !== 'none';
            newThreadForm.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                document.getElementById('newThreadTitle').focus();
            }
        });
    }

    if (cancelThreadBtn) {
        cancelThreadBtn.addEventListener('click', () => {
            newThreadForm.style.display = 'none';
            document.getElementById('newThreadTitle').value = '';
            document.getElementById('newThreadBody').value = '';
            document.getElementById('newThreadAuthor').value = '';
        });
    }

    if (submitThreadBtn) {
        submitThreadBtn.addEventListener('click', () => {
            const title = document.getElementById('newThreadTitle').value.trim();
            const body = document.getElementById('newThreadBody').value.trim();
            const tag = document.getElementById('newThreadTag').value;
            const author = document.getElementById('newThreadAuthor').value.trim() || 'Anónimo';

            if (!title || !body) {
                if (!title) {
                    document.getElementById('newThreadTitle').style.borderColor = 'var(--error)';
                    setTimeout(() => document.getElementById('newThreadTitle').style.borderColor = '', 1500);
                }
                if (!body) {
                    document.getElementById('newThreadBody').style.borderColor = 'var(--error)';
                    setTimeout(() => document.getElementById('newThreadBody').style.borderColor = '', 1500);
                }
                return;
            }

            const tagClass = `thread__tag--${tag}`;
            const tagLabels = {
                case: 'Estudio de Caso',
                inquiry: 'Consulta Clínica',
                review: 'Revisión de Investigación'
            };

            const newId = threadIdCounter++;
            const threadHTML = `
                <article class="thread" data-id="${newId}" style="animation: fadeIn 0.3s ease;">
                    <div class="thread__votes">
                        <span class="material-symbols-outlined thread__vote-icon">expand_less</span>
                        <span class="thread__vote-count">0</span>
                    </div>
                    <div class="thread__content">
                        <h3 class="thread__title">${escapeHTML(title)}</h3>
                        <div class="thread__meta">
                            <span class="thread__tag ${tagClass}">${tagLabels[tag]}</span>
                            <span>Publicado por ${escapeHTML(author)}</span>
                            <span>&middot;</span>
                            <span>Ahora mismo</span>
                            <span>&middot;</span>
                            <span class="thread__replies">
                                <span class="material-symbols-outlined">chat_bubble</span>
                                <span class="thread__reply-count">0</span> respuestas
                            </span>
                        </div>
                    </div>
                    <button class="thread__expand-btn" aria-label="Expandir comentarios">
                        <span class="material-symbols-outlined">expand_more</span>
                    </button>
                </article>
            `;

            const commentsHTML = `
                <div class="comments-panel" id="comments-${newId}" style="display:none;">
                    <div class="comments-panel__list" id="comments-list-${newId}"></div>
                    <div class="comments-panel__form">
                        <input type="text" class="comments-panel__author-input" placeholder="Tu nombre..." maxlength="40">
                        <textarea class="comments-panel__input" placeholder="Escribe tu comentario..." rows="2" maxlength="300"></textarea>
                        <button class="btn btn--primary btn--sm comments-panel__submit" data-thread="${newId}">Comentar</button>
                    </div>
                </div>
            `;

            const threadsContainer = document.getElementById('forumThreads');
            threadsContainer.insertAdjacentHTML('afterbegin', threadHTML);
            threadsContainer.insertAdjacentHTML('afterbegin', commentsHTML);

            // Re-bind events for the new thread
            const newThreadEl = threadsContainer.querySelector(`.thread[data-id="${newId}"]`);
            const newExpandBtn = newThreadEl.querySelector('.thread__expand-btn');
            const newVoteIcon = newThreadEl.querySelector('.thread__vote-icon');

            newExpandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const panel = document.getElementById(`comments-${newId}`);
                const isVisible = panel.style.display !== 'none';
                document.querySelectorAll('.comments-panel').forEach(p => p.style.display = 'none');
                document.querySelectorAll('.thread__expand-btn').forEach(b => b.classList.remove('active'));
                if (!isVisible) {
                    panel.style.display = 'block';
                    newExpandBtn.classList.add('active');
                }
            });

            newThreadEl.querySelector('.thread__content').addEventListener('click', () => {
                newExpandBtn.click();
            });

            newVoteIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const countEl = newVoteIcon.nextElementSibling;
                let count = parseInt(countEl.textContent);
                if (newVoteIcon.classList.contains('voted')) {
                    newVoteIcon.classList.remove('voted');
                    newVoteIcon.style.color = '';
                    newVoteIcon.style.fontVariationSettings = "'FILL' 0";
                    count--;
                } else {
                    newVoteIcon.classList.add('voted');
                    newVoteIcon.style.color = 'var(--primary)';
                    newVoteIcon.style.fontVariationSettings = "'FILL' 1";
                    count++;
                }
                countEl.textContent = count;
            });

            // Bind comment submit for new thread
            const newSubmitBtn = threadsContainer.querySelector(`#comments-${newId} .comments-panel__submit`);
            newSubmitBtn.addEventListener('click', () => {
                const panel = document.getElementById(`comments-${newId}`);
                const list = document.getElementById(`comments-list-${newId}`);
                const input = panel.querySelector('.comments-panel__input');
                const authorInput = panel.querySelector('.comments-panel__author-input');
                const text = input.value.trim();
                const commAuthor = authorInput.value.trim() || 'Anónimo';

                if (!text) {
                    input.style.borderColor = 'var(--error)';
                    setTimeout(() => input.style.borderColor = '', 1500);
                    return;
                }

                const initials = commAuthor.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                const isAlt = list.children.length % 2 !== 0;

                list.insertAdjacentHTML('beforeend', `
                    <div class="comment" style="animation: fadeIn 0.3s ease;">
                        <div class="comment__avatar ${isAlt ? 'comment__avatar--alt' : ''}">${initials}</div>
                        <div class="comment__body">
                            <div class="comment__header">
                                <span class="comment__author">${escapeHTML(commAuthor)}</span>
                                <span class="comment__time">Ahora mismo</span>
                            </div>
                            <p class="comment__text">${escapeHTML(text)}</p>
                        </div>
                    </div>
                `);
                input.value = '';

                const replyCount = newThreadEl.querySelector('.thread__reply-count');
                replyCount.textContent = parseInt(replyCount.textContent) + 1;
            });

            // Reset form
            newThreadForm.style.display = 'none';
            document.getElementById('newThreadTitle').value = '';
            document.getElementById('newThreadBody').value = '';
            document.getElementById('newThreadAuthor').value = '';
        });
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --- Escape key closes modals ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal.classList.remove('open');
            searchBar.classList.remove('open');
            navMenu.classList.remove('open');
            if (newThreadForm) newThreadForm.style.display = 'none';
        }
    });

});

// Global helper
function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}