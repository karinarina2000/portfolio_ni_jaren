// ================================
// Theme Toggle (Dark/Light Mode)
// ================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

if (themeToggle) {
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
        
        // Update navbar background immediately
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const isLightTheme = newTheme === 'light';
            if (window.scrollY > 50) {
                navbar.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 15, 0.95)';
            } else {
                navbar.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 15, 0.8)';
            }
        }
    });
}

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
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const isLightTheme = html.getAttribute('data-theme') === 'light';

    if (window.scrollY > 50) {
        navbar.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    // Update scroll progress bar
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
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
        const apiEndpoint = (contactForm.dataset.apiEndpoint || '/api/contact').trim();
        const actionUrl = (contactForm.getAttribute('action') || '').trim();
        const hasFormspreeEndpoint = actionUrl && !actionUrl.includes('your-form-id');
        const isNetlifyForm = contactForm.hasAttribute('data-netlify');

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span>';

        try {
            let response;

            if (apiEndpoint) {
                const payload = {
                    name: (formData.get('name') || '').toString().trim(),
                    email: (formData.get('email') || '').toString().trim(),
                    subject: (formData.get('subject') || '').toString().trim(),
                    message: (formData.get('message') || '').toString().trim(),
                    botField: (formData.get('bot-field') || '').toString().trim()
                };

                response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } else if (hasFormspreeEndpoint) {
                response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            } else if (isNetlifyForm) {
                const encodedData = new URLSearchParams();
                formData.forEach((value, key) => {
                    encodedData.append(key, value.toString());
                });

                response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encodedData.toString()
                });
            } else {
                throw new Error('No contact form endpoint configured.');
            }

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
                const fallbackAllowed = apiEndpoint && (hasFormspreeEndpoint || isNetlifyForm);

                if (fallbackAllowed) {
                    if (hasFormspreeEndpoint) {
                        response = await fetch(actionUrl, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                    } else {
                        const encodedData = new URLSearchParams();
                        formData.forEach((value, key) => {
                            encodedData.append(key, value.toString());
                        });

                        response = await fetch('/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: encodedData.toString()
                        });
                    }
                }

                if (response && response.ok) {
                    submitButton.innerHTML = '<span>Message Sent! ✓</span>';
                    submitButton.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                    contactForm.reset();

                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                        submitButton.style.background = '';
                    }, 3000);
                    return;
                }

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
        'IT Student | OJT Experience',
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
// Parallax Effect for Hero Section
// ================================
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const heroVisual = document.querySelector('.hero-visual');

if (heroSection && heroContent && heroVisual) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        heroContent.style.transform = `translateY(${rate * 0.3}px)`;
        heroVisual.style.transform = `translateY(${rate * 0.5}px)`;
    });
}

// ================================
// Magnetic Button Effect
// ================================
const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0) scale(1)';
    });
});

// ================================
// 3D Tilt Effect on Project Cards
// ================================
const tiltCards = document.querySelectorAll('.project-card, .certificate-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ================================
// Particle Background Effect
// ================================
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles-bg';
    document.body.insertBefore(particleContainer, document.body.firstChild);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particleContainer.appendChild(particle);
    }
}

createParticles();

// ================================
// Smooth Reveal Animations
// ================================
const revealElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .certificate-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('reveal-active');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ================================
// Cursor Trail Effect
// ================================
let cursorTrail = [];
const trailLength = 20;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

// ================================
// Text Gradient Animation on Hover
// ================================
const titles = document.querySelectorAll('h1, h2, h3');

titles.forEach(title => {
    title.addEventListener('mouseenter', function() {
        this.style.backgroundImage = 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1)';
        this.style.backgroundSize = '200% auto';
        this.style.backgroundClip = 'text';
        this.style.webkitBackgroundClip = 'text';
        this.style.webkitTextFillColor = 'transparent';
        this.style.animation = 'gradientShift 3s linear infinite';
    });
    
    title.addEventListener('mouseleave', function() {
        this.style.backgroundImage = '';
        this.style.backgroundClip = '';
        this.style.webkitBackgroundClip = '';
        this.style.webkitTextFillColor = '';
        this.style.animation = '';
    });
});

// ================================
// Floating Icons Animation
// ================================
const floatingIcons = document.querySelectorAll('.floating-icons .icon');

floatingIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.2}s`;
});

// ================================
// Console Message for Developers
// ================================
console.log('%c👨‍🎓 My Portfolio', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cIT Student | OJT Journey | Full Stack Developer', 'color: #a1a1aa; font-size: 12px;');
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
