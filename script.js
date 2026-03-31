// ================================
// Theme Toggle (Dark/Light Mode)
// ================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Add animation to toggle button
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

// ================================
// Mobile Navigation Toggle
// ================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ================================
// Smooth Scroll for Anchor Links
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or empty
        if (href === '#' || !href) return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// Navbar Background on Scroll
// ================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const isLightTheme = html.getAttribute('data-theme') === 'light';

    if (window.scrollY > 50) {
        navbar.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Update navbar background for light theme
if (html.getAttribute('data-theme') === 'light') {
    navbar.style.background = 'rgba(255, 255, 255, 0.8)';
}

// ================================
// Active Navigation Link Highlighting
// ================================
const sections = document.querySelectorAll('section');
const navLinksElements = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksElements.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent-primary)';
        }
    });
});

// ================================
// Project Filtering
// ================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease-out forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ================================
// Scroll Animation Observer
// ================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.animate-on-scroll, .skill-category, .timeline-item, .project-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// ================================
// Contact Form Handling
// ================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span>';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success message
                submitButton.innerHTML = '<span>Message Sent! ✓</span>';
                submitButton.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                contactForm.reset();

                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    submitButton.style.background = '';
                }, 3000);
            } else {
                // Error message
                submitButton.innerHTML = '<span>Something went wrong. Try again.</span>';
                submitButton.disabled = false;
            }
        } catch (error) {
            submitButton.innerHTML = '<span>Something went wrong. Try again.</span>';
            submitButton.disabled = false;
        }
    });
}

// ================================
// Typing Effect for Hero (Optional)
// ================================
const titleElement = document.querySelector('.title');
if (titleElement) {
    const titles = [
        'CS Student | OJT Experience',
        'Full Stack Developer',
        'Problem Solver & Learner',
        'Building Real Projects'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeTitle() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            titleElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            titleElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500; // Pause before typing new word
        }

        setTimeout(typeTitle, typingSpeed);
    }

    // Start typing effect after a delay
    setTimeout(typeTitle, 1000);
}

// ================================
// Stats Counter Animation
// ================================
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const rawValue = stat.textContent.trim();
                const hasPlus = rawValue.includes('+');
                const target = parseFloat(rawValue.replace('+', ''));
                const hasDecimal = rawValue.includes('.');

                if (!isNaN(target)) {
                    animateCounter(stat, target, { hasPlus, hasDecimal });
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

function animateCounter(element, target, options = {}) {
    const { hasPlus = false, hasDecimal = false } = options;
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            const finalValue = hasDecimal ? target.toFixed(1) : Math.round(target).toString();
            element.textContent = hasPlus ? `${finalValue}+` : finalValue;
            clearInterval(timer);
        } else {
            const inProgressValue = hasDecimal ? current.toFixed(1) : Math.floor(current).toString();
            element.textContent = hasPlus ? `${inProgressValue}+` : inProgressValue;
        }
    }, stepTime);
}

// ================================
// Console Message for Developers
// ================================
console.log('%c👨‍🎓 My Portfolio', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cCS Student | OJT Journey | Full Stack Developer', 'color: #a1a1aa; font-size: 12px;');
console.log('%cOpen to Opportunities & Collaboration', 'color: #6366f1; font-size: 12px;');

// ================================
// Performance: Lazy Load Images (when you add them)
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});
