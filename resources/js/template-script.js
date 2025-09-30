// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
    const mobileMenuLogo = document.querySelector('.mobile-menu-logo');

    // Check if essential elements exist
    if (
        !mobileMenuBtn ||
        !mobileMenu ||
        !mobileMenuOverlay ||
        !mobileMenuClose
    ) {
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset and trigger animations for links
        mobileMenuLinks.forEach((link, index) => {
            if (link) {
                link.style.animation = 'none';
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';

                // Apply animation with delay
                setTimeout(() => {
                    if (link) {
                        link.style.animation = `slideInLeft 0.4s ease forwards`;
                    }
                }, 250 + index * 100);
            }
        });

        // Animate CTA button
        if (mobileMenuCta) {
            mobileMenuCta.style.animation = 'none';
            mobileMenuCta.style.opacity = '0';
            mobileMenuCta.style.transform = 'translateY(20px)';

            setTimeout(() => {
                if (mobileMenuCta) {
                    mobileMenuCta.style.animation =
                        'slideInUp 0.4s ease forwards';
                }
            }, 100);
        }
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });

    mobileMenuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });

    // Close menu when clicking on navigation links
    mobileMenuLinks.forEach((link) => {
        if (link) {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // Close menu when clicking on CTA button
    if (mobileMenuCtaButton) {
        mobileMenuCtaButton.addEventListener('click', (e) => {
            if (mobileMenuCtaButton.getAttribute('href') === '#') {
                e.preventDefault();
            }
            closeMobileMenu();
        });
    }

    // Close menu when clicking on logo
    if (mobileMenuLogo) {
        mobileMenuLogo.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Prevent body scroll when menu is open
    if (mobileMenu) {
        mobileMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
    }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

// Interactive mouse glow effect (throttled for performance)
let mouseTimer;
document.addEventListener('mousemove', (e) => {
    if (!mouseTimer) {
        mouseTimer = setTimeout(() => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Move orbs slightly based on mouse position
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - window.innerWidth / 2) * speed;
                const y = (mouseY - window.innerHeight / 2) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });

            // Make nearby particles glow brighter (desktop only)
            if (window.innerWidth > 768) {
                const particles = document.querySelectorAll('.particle');
                particles.forEach((particle) => {
                    const rect = particle.getBoundingClientRect();
                    const particleX = rect.left + rect.width / 2;
                    const particleY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(
                        Math.pow(mouseX - particleX, 2) +
                            Math.pow(mouseY - particleY, 2)
                    );

                    if (distance < 150) {
                        const brightness = 1 - distance / 150;
                        particle.style.boxShadow = `0 0 ${
                            20 + brightness * 30
                        }px rgba(0, 255, 255, ${0.5 + brightness * 0.5})`;
                        particle.style.transform = `scale(${
                            1 + brightness * 0.5
                        })`;
                    } else {
                        particle.style.boxShadow = '';
                        particle.style.transform = '';
                    }
                });
            }

            mouseTimer = null;
        }, 16); // ~60fps
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if href is more than just '#'
        if (href && href.length > 1) {
            e.preventDefault();
            if (href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 15, 35, 0.95)';
        nav.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
    } else {
        nav.style.background = 'rgba(15, 15, 35, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
});

// Button effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach((button) => {
    button.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
    });

    button.addEventListener('mouseleave', function () {
        this.style.boxShadow = '';
    });
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat) => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        let count = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(timer);
                count = target;
            }
            const suffix = stat.textContent.replace(/[\d]/g, '');
            stat.textContent = Math.floor(count) + suffix;
        }, 20);
    });
};

// Trigger stats animation when section is visible
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Glitch effect on hover for feature cards
document.querySelectorAll('.feature-card').forEach((card) => {
    card.addEventListener('mouseenter', function () {
        this.style.animation = 'glitch1 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

// Random cyber text effects
const cyberTexts = [
    'CONNECTING...',
    'NEURAL LINK ESTABLISHED',
    'QUANTUM SYNC ACTIVE',
    'REALITY MATRIX LOADED',
];

setInterval(() => {
    const randomText =
        cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
    const tempElement = document.createElement('div');
    tempElement.textContent = randomText;
    tempElement.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                color: var(--primary-cyan);
                font-size: 0.8rem;
                font-weight: 700;
                z-index: 1000;
                opacity: 0.7;
                pointer-events: none;
                animation: fadeOut 3s ease-out forwards;
                text-shadow: 0 0 10px var(--primary-cyan);
            `;
    document.body.appendChild(tempElement);

    setTimeout(() => {
        document.body.removeChild(tempElement);
    }, 3000);
}, 5000);

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 0.7; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-50px); }
            }
        `;
document.head.appendChild(style);

// Contact form submission
if (document.querySelector('.btn-submit')) {
    document
        .querySelector('.btn-submit')
        .addEventListener('click', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                // Simulate form submission
                this.textContent = 'TRANSMITTING...';
                this.style.background =
                    'linear-gradient(135deg, var(--primary-cyan), var(--primary-pink))';

                setTimeout(() => {
                    this.textContent = 'TRANSMISSION COMPLETE';
                    this.style.background = 'var(--primary-cyan)';

                    // Clear form
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('message').value = '';

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        this.textContent = 'Transmit Message';
                        this.style.background = '';
                    }, 3000);
                }, 2000);
            }
        });
}
