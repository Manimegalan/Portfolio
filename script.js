// ===========================
// Utility Functions
// ===========================

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for non-section links
            if (href === '#' || href === '#content') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Scroll to target
                const navHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// Mobile Menu
// ===========================

const menuToggle = document.getElementById('menuToggle');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function openMobileMenu() {
    menuOpen = true;
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    menuOpen = false;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

function toggleMobileMenu() {
    if (menuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a link
if (mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuOpen && 
        !mobileMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
        closeMobileMenu();
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuOpen) {
        closeMobileMenu();
    }
});

// ===========================
// Navigation Bar Scroll Behavior
// ===========================

const header = document.getElementById('header');
let lastScrollTop = 0;
let scrollDirection = 'down';

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Determine scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        scrollDirection = 'down';
        header.classList.add('hidden');
    } else {
        // Scrolling up
        scrollDirection = 'up';
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Throttle scroll event
window.addEventListener('scroll', throttle(handleScroll, 100));

// ===========================
// Jobs Tabs
// ===========================

const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const highlight = document.querySelector('.highlight');

function setActiveTab(index) {
    // Remove active class from all buttons and panels
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
    });
    
    // Add active class to selected button and panel
    if (tabButtons[index]) {
        tabButtons[index].classList.add('active');
        tabButtons[index].setAttribute('aria-selected', 'true');
    }
    
    if (tabPanels[index]) {
        tabPanels[index].classList.add('active');
        tabPanels[index].removeAttribute('hidden');
    }
    
    // Move highlight
    if (highlight) {
        if (window.innerWidth > 600) {
            // Vertical tabs (desktop)
            highlight.style.transform = `translateY(${index * 42}px)`;
        } else {
            // Horizontal tabs (mobile)
            highlight.style.transform = `translateX(${index * 120}px)`;
        }
    }
}

// Set up tab click handlers
tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        setActiveTab(index);
    });
});

// Keyboard navigation for tabs
document.querySelector('.tab-list')?.addEventListener('keydown', (e) => {
    const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
    let newIndex = currentIndex;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabButtons.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        newIndex = currentIndex - 1 < 0 ? tabButtons.length - 1 : currentIndex - 1;
    }
    
    if (newIndex !== currentIndex) {
        setActiveTab(newIndex);
        tabButtons[newIndex].focus();
    }
});

// Update highlight position on window resize
window.addEventListener('resize', throttle(() => {
    const activeIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
    if (activeIndex !== -1) {
        setActiveTab(activeIndex);
    }
}, 100));

// ===========================
// External Links
// ===========================

function handleExternalLinks() {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
        allLinks.forEach(link => {
            if (link.host && link.host !== window.location.host) {
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
            }
        });
    }
}

// ===========================
// Scroll Reveal Animation (Simple)
// ===========================

function revealOnScroll() {
    const elements = document.querySelectorAll('section');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Add initial styles for scroll reveal
function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
}

// ===========================
// Active Navigation Link
// ===========================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===========================
// Initialize Everything
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Set up smooth scrolling
    setupSmoothScrolling();
    
    // Handle external links
    handleExternalLinks();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initial reveal check
    setTimeout(() => {
        revealOnScroll();
    }, 100);
    
    // Set initial active tab
    setActiveTab(0);
    
    // Set up scroll-based animations
    window.addEventListener('scroll', throttle(() => {
        revealOnScroll();
        updateActiveNavLink();
    }, 100));
    
    // Update active nav link on load
    updateActiveNavLink();
});

// ===========================
// Loading Animation
// ===========================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '1';
        }
    }, 100);
});
