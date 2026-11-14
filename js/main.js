// ========================================
// Relax & Bodyline by Stella — Main JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile menu toggle ---
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll animations ---
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .about-text, .about-image, .contact-info, .contact-form-wrapper'
    );

    animatedElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- reCAPTCHA v3, loaded only when a form is used ---
    const RECAPTCHA_KEY = '6LfBBawsAAAAANgP5elZIViGBFMlLY2BWZueMIHv';
    let recaptchaLoading = null;

    function loadRecaptcha() {
        if (!recaptchaLoading) {
            recaptchaLoading = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`;
                script.async = true;
                script.onload = () => window.grecaptcha.ready(resolve);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        return recaptchaLoading;
    }

    function getToken(action) {
        return loadRecaptcha().then(() => window.grecaptcha.execute(RECAPTCHA_KEY, { action }));
    }

    function protectForm(form, action, tokenFieldId) {
        if (!form) return;
        // Start loading as soon as the visitor interacts with the form
        form.addEventListener('focusin', () => { loadRecaptcha().catch(() => {}); }, { once: true });

        let sending = false;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (sending) return;
            sending = true;
            const send = () => form.submit();
            // If reCAPTCHA is blocked (ad blocker, network), still send the form after 5 s:
            // FormSubmit has its own spam protection, and a lost appointment request is worse.
            const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
            Promise.race([
                getToken(action).then((token) => {
                    document.getElementById(tokenFieldId).value = token;
                }),
                timeout,
            ]).catch(() => {}).finally(send);
        });
    }

    protectForm(document.getElementById('contactForm'), 'contact', 'recaptchaResponse');
    protectForm(document.getElementById('reviewForm'), 'review', 'recaptchaResponseReview');

    // --- Toggle review form ---
    const toggleBtn = document.getElementById('toggleReviewForm');
    const reviewWrapper = document.getElementById('reviewFormWrapper');
    if (toggleBtn && reviewWrapper) {
        toggleBtn.addEventListener('click', () => {
            const visible = reviewWrapper.style.display !== 'none';
            reviewWrapper.style.display = visible ? 'none' : 'block';
            toggleBtn.textContent = visible ? 'Laat een recensie achter' : 'Sluiten';
        });
    }

    // --- Testimonials carousel ---
    const cards = document.querySelectorAll('.carousel-track .testimonial-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let current = 0;

    if (cards.length > 0 && dotsContainer) {
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Recensie ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goTo(index) {
            cards[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = index;
            cards[current].classList.add('active');
            dots[current].classList.add('active');
        }

        prevBtn.addEventListener('click', () => goTo((current - 1 + cards.length) % cards.length));
        nextBtn.addEventListener('click', () => goTo((current + 1) % cards.length));

        // Auto-rotate every 60 seconds
        setInterval(() => goTo((current + 1) % cards.length), 60000);
    }

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
});
