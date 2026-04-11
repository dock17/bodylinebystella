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
        '.service-card, .pricing-card, .testimonial-card, .about-text, .about-image, .contact-info, .contact-form-wrapper'
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

    // --- reCAPTCHA v3 on form submit ---
    const RECAPTCHA_KEY = '6LfBBawsAAAAANgP5elZIViGBFMlLY2BWZueMIHv';

    function protectForm(form, action, tokenFieldId) {
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            grecaptcha.ready(() => {
                grecaptcha.execute(RECAPTCHA_KEY, { action }).then((token) => {
                    document.getElementById(tokenFieldId).value = token;
                    form.submit();
                });
            });
        });
    }

    protectForm(document.getElementById('contactForm'), 'contact', 'recaptchaResponse');
    protectForm(document.getElementById('reviewForm'), 'review', 'recaptchaResponseReview');

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
