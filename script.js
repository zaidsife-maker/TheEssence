document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const navBtns = document.querySelectorAll('.nav-btn');

    // ----------------------------------------------------
    // ROUTER LOGIC
    // ----------------------------------------------------
    function router() {
        const hash = window.location.hash;

        // Remove active class from all buttons
        navBtns.forEach(btn => btn.classList.remove('active'));

        if (hash === '' || hash === '#home') {
            updateActiveNav('home');
            renderHome();
        } else if (hash.startsWith('#category/')) {
            const category = hash.split('/')[1];
            updateActiveNav(category);
            renderCategory(category);
        } else if (hash.startsWith('#post/')) {
            const postId = hash.split('/')[1];
            const post = blogPosts.find(p => p.id === postId);
            if (post) updateActiveNav(post.category);
            renderPost(postId);
        } else {
            renderHome();
        }
    }

    function updateActiveNav(tabId) {
        const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
        if (btn) btn.classList.add('active');
    }

    function navigateTo(hash) {
        window.location.hash = hash;
    }

    // ----------------------------------------------------
    // RENDERERS
    // ----------------------------------------------------

    // 1. Home View
    function renderHome() {
        appContainer.innerHTML = `
            <div class="fade-in">
                <div style="text-align: center; margin-bottom: 4rem;">
                    <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary); font-family: var(--font-heading);">مرحباً بكم في بوابة العلوم</h2>
                    <p style="font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
                        استكشف جمال الكون ودقة الرياضيات وقوة البرمجة.
                    </p>
                </div>

                <!-- Sections Grid -->
                <div style="margin-bottom: 4rem;">
                    <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: var(--font-heading); font-size: 1.5rem; text-align: center;">الأقسام الرئيسية</h3>
                    <div class="posts-grid">
                        <div class="concept-card" onclick="window.location.hash='#category/physics'" style="cursor: pointer; align-items: center; text-align: center;">
                            <div class="concept-icon"><i class="fa-solid fa-atom"></i></div>
                            <h3 class="concept-title">الفيزياء</h3>
                            <p class="concept-description">اكتشف أسرار الكون والثقوب السوداء.</p>
                        </div>
                        <div class="concept-card" onclick="window.location.hash='#category/math'" style="cursor: pointer; align-items: center; text-align: center;">
                            <div class="concept-icon"><i class="fa-solid fa-square-root-variable"></i></div>
                            <h3 class="concept-title">الرياضيات</h3>
                            <p class="concept-description">لغة الطبيعة والأنماط المعقدة.</p>
                        </div>
                        <div class="concept-card" onclick="window.location.hash='#category/cs'" style="cursor: pointer; align-items: center; text-align: center;">
                            <div class="concept-icon"><i class="fa-solid fa-laptop-code"></i></div>
                            <h3 class="concept-title">علوم الحاسوب</h3>
                            <p class="concept-description">ذكاء الآلة والعوالم الافتراضية.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. Category View
    function renderCategory(category) {
        const posts = blogPosts.filter(post => post.category === category);
        const categoryNames = {
            'physics': { title: 'الفيزياء', icon: 'fa-atom' },
            'math': { title: 'الرياضيات', icon: 'fa-square-root-variable' },
            'cs': { title: 'علوم الحاسوب', icon: 'fa-laptop-code' }
        };
        const catInfo = categoryNames[category] || { title: category, icon: 'fa-folder' };

        appContainer.innerHTML = `
            <div class="fade-in">
                 <div style="text-align: center; margin-bottom: 3rem;">
                    <h2 style="font-size: 2rem; color: var(--text-primary); font-family: var(--font-heading);">
                        <i class="fa-solid ${catInfo.icon}" style="color: var(--accent-color);"></i> ${catInfo.title}
                    </h2>
                </div>
                <div class="posts-grid">
                    ${posts.length > 0
                ? posts.map(post => createPostCard(post)).join('')
                : '<p style="text-align:center; color: var(--text-secondary);">لا توجد مقالات في هذا القسم بعد.</p>'}
                </div>
            </div>
        `;
    }

    // 4. Post Detail View
    function renderPost(id) {
        const post = blogPosts.find(p => p.id === id);
        if (!post) {
            appContainer.innerHTML = `<h2 style="text-align:center; margin-top: 3rem;">المقال غير موجود</h2>`;
            return;
        }

        appContainer.innerHTML = `
            <div class="fade-in">
                <a href="#category/${post.category}" class="back-btn">
                    <i class="fa-solid fa-arrow-right"></i> عودة
                </a>
                <article class="post-container">
                    <header class="post-header">
                        <h1>${post.title}</h1>
                        <div class="post-meta">
                            <span><i class="fa-solid fa-tag"></i> ${getCategoryName(post.category)}</span>
                        </div>
                    </header>
                    <div class="post-content">
                        ${post.content}
                    </div>
                </article>
            </div>
        `;
    }

    function formatTimeSpent(seconds) {
        if (seconds < 60) return seconds + ' ثانية';
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours} ساعة و ${minutes % 60} دقيقة`;
        }
        return `${minutes} دقيقة`;
    }

    // Helper: Create HTML for a post card
    function createPostCard(post) {
        const icons = {
            'physics': 'fa-atom',
            'math': 'fa-square-root-variable',
            'cs': 'fa-laptop-code'
        };

        return `
            <div class="concept-card">
                <div class="concept-icon"><i class="fa-solid ${icons[post.category] || 'fa-file-alt'}"></i></div>
                <h3 class="concept-title">${post.title}</h3>
                <p class="concept-description">${post.summary}</p>
                <a href="#post/${post.id}" class="read-more-btn">اقرأ المزيد <i class="fa-solid fa-arrow-left" style="font-size: 0.8em;"></i></a>
            </div>
        `;
    }

    function getCategoryName(cat) {
        const map = { 'physics': 'الفيزياء', 'math': 'الرياضيات', 'cs': 'علوم الحاسوب' };
        return map[cat] || cat;
    }

    // ----------------------------------------------------
    // EVENT LISTENERS
    // ----------------------------------------------------

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab === 'home') navigateTo('');
            else navigateTo(`category/${tab}`);
        });
    });

    window.addEventListener('hashchange', router);
    router();

    // ----------------------------------------------------
    // DARK MODE LOGIC
    // ----------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // ----------------------------------------------------
    // AUTO SCROLL LOGIC
    // ----------------------------------------------------
    let scrollRequest; // instead of scrollInterval
    let scrollSpeed = 5;
    let isScrolling = false;
    let scrollAccumulator = 0; // Defines buffer for slow scrolling

    // Elements matching index.html IDs
    const btnToggle = document.getElementById('toggle-scroll');
    const btnSpeedUp = document.getElementById('speed-up');
    const btnSpeedDown = document.getElementById('speed-down');
    const displaySpeed = document.getElementById('speed-display');

    // Helper to find icon inside button safely
    const getToggleIcon = () => btnToggle ? btnToggle.querySelector('i') : null;

    function toggleScroll() {
        if (isScrolling) {
            stopScrolling();
        } else {
            startScrolling();
        }
    }

    function scrollStep(timestamp) {
        if (!isScrolling) return;

        // Accumulate fractional scrolling
        // Factor 0.15 means Speed 1 moves ~1px every 6-7 frames (smooth slow crawl)
        scrollAccumulator += (scrollSpeed * 0.15);

        if (scrollAccumulator >= 1) {
            const pixelsToScroll = Math.floor(scrollAccumulator);
            window.scrollBy({
                top: pixelsToScroll,
                left: 0,
                behavior: 'auto' // Important: use 'auto' for direct pixel manipulation in rAF
            });
            scrollAccumulator -= pixelsToScroll;

            // Check if reached bottom
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
                window.scrollTo(0, 0); // loop back
            }
        }
        
        scrollRequest = requestAnimationFrame(scrollStep);
    }

    function startScrolling() {
        if (isScrolling) return;
        isScrolling = true;
        updateUI();
        scrollRequest = requestAnimationFrame(scrollStep);
    }

    function stopScrolling() {
        isScrolling = false;
        if (scrollRequest) {
            cancelAnimationFrame(scrollRequest);
        }
        updateUI();
    }

    function updateUI() {
        const icon = getToggleIcon();
        if (!icon) return;

        if (isScrolling) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            btnToggle.title = "إيقاف";
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            btnToggle.title = "تشغيل";
        }

        if (displaySpeed) {
            displaySpeed.textContent = scrollSpeed;
        }
    }

    function changeSpeed(delta) {
        let newSpeed = scrollSpeed + delta;
        if (newSpeed >= 1 && newSpeed <= 10) {
            scrollSpeed = newSpeed;
            updateUI();
        }
    }

    // Attach listeners with null checks
    if (btnToggle) btnToggle.addEventListener('click', toggleScroll);
    if (btnSpeedUp) btnSpeedUp.addEventListener('click', () => changeSpeed(1));
    if (btnSpeedDown) btnSpeedDown.addEventListener('click', () => changeSpeed(-1));


});
