// EAAC Pearson BTEC Website - Main JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeAnimations();
    initializeFAQ();
    initializeModernAnimations();
    loadCourseData();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Debug: Check if elements exist
    console.log('Navigation elements found:', {
        mobileMenuToggle: !!mobileMenuToggle,
        navMenu: !!navMenu,
        dropdowns: dropdowns.length
    });
    
    // Debug: Check dropdown structure
    dropdowns.forEach((dropdown, index) => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        console.log(`Dropdown ${index}:`, {
            toggle: !!toggle,
            menu: !!menu,
            toggleText: toggle ? toggle.textContent.trim() : 'N/A'
        });
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    });

    // Mobile-only solution: Replace dropdown with individual menu items
    function handleMobileNavigation() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Check if mobile links already exist to prevent duplicates
            const existingMobileLinks = navMenu.querySelectorAll('.mobile-course-link');
            if (existingMobileLinks.length > 0) {
                console.log('Mobile navigation: Already initialized, skipping');
                return;
            }
            
            // Find the dropdown
            const dropdown = navMenu.querySelector('.dropdown');
            if (dropdown) {
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                
                if (dropdownMenu && dropdownToggle) {
                    // Hide the original dropdown toggle
                    dropdownToggle.style.display = 'none';
                    
                    // Get all course links from dropdown menu
                    const courseLinks = dropdownMenu.querySelectorAll('a');
                    
                    // Create individual menu items for each course
                    courseLinks.forEach(link => {
                        const newMenuItem = document.createElement('li');
                        const newLink = document.createElement('a');
                        
                        newLink.href = link.href;
                        newLink.textContent = link.textContent;
                        newLink.className = 'mobile-course-link';
                        
                        newMenuItem.appendChild(newLink);
                        
                        // Insert after the dropdown
                        dropdown.parentNode.insertBefore(newMenuItem, dropdown.nextSibling);
                    });
                    
                    console.log('Mobile navigation: Replaced dropdown with individual menu items');
                }
            }
        } else {
            // Desktop: Restore original dropdown functionality
            restoreDesktopDropdown();
        }
    }
    
    function restoreDesktopDropdown() {
        // Remove mobile course links and their parent li elements
        const mobileLinks = navMenu.querySelectorAll('.mobile-course-link');
        mobileLinks.forEach(link => {
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.remove();
            }
        });
        
        // Show dropdown toggle
        const dropdownToggle = navMenu.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.style.display = '';
        }
        
        console.log('Desktop navigation: Restored dropdown functionality');
    }
    
    // Initialize mobile navigation
    handleMobileNavigation();
    
    // Handle window resize with debounce to prevent multiple rapid calls
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            console.log('Window resized, reinitializing navigation');
            // First restore to clean state
            restoreDesktopDropdown();
            // Then reinitialize
            handleMobileNavigation();
        }, 250);
    });

    // Handle mobile menu link clicks
    navMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('mobile-course-link')) {
            // Close mobile menu when course link is clicked
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        }
    });

    // Active navigation highlighting
    updateActiveNavigation();
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
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

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (!targetId || targetId === '#' || targetId.length <= 1) {
                return;
            }
            
            try {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    e.preventDefault();
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.warn('Invalid selector:', targetId, error);
            }
        });
    });
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const course = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
            this.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .feature-item, .stat-item');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Add CSS for animations
    addAnimationStyles();
}

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-element:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .animate-element:nth-child(3) {
            transition-delay: 0.2s;
        }
        
        .animate-element:nth-child(4) {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);
}

// ===== COURSE DATA LOADING =====
async function loadCourseData() {
    try {
        // Determine the correct path based on current location
        const isInPagesFolder = window.location.pathname.includes('/pages/');
        const dataPath = isInPagesFolder ? '../data/courses.json' : 'data/courses.json';
        
        const response = await fetch(dataPath);
        const data = await response.json();
        
        // Store course data globally
        window.courseData = data;
        
        // Update course counts if elements exist
        updateCourseCounts(data);
        
    } catch (error) {
        console.log('Course data will be loaded when available');
    }
}

function updateCourseCounts(data) {
    const categories = data.categories;
    
    // Update course counts in category cards
    Object.keys(categories).forEach(categoryKey => {
        const category = categories[categoryKey];
        const courseCountElement = document.querySelector(`[data-category="${categoryKey}"] .course-count`);
        
        if (courseCountElement && category.courses) {
            courseCountElement.textContent = `${category.courses.length} Course${category.courses.length !== 1 ? 's' : ''} Available`;
        }
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(updateActiveNavigation, 10);
window.addEventListener('scroll', optimizedScrollHandler);

// ===== COURSE CARD INTERACTIONS =====
function initializeCourseCards() {
    const courseCards = document.querySelectorAll('.category-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
}

// ===== STATISTICS COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 16);
    });
}

// Initialize counter animation when stats section is visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    statsObserver.observe(statsSection);
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            filterCourses(searchTerm);
        }, 300));
    }
}

function filterCourses(searchTerm) {
    const courseCards = document.querySelectorAll('.category-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherAnswer) otherAnswer.classList.remove('active');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.classList.remove('active');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    item.classList.add('active');
                    answer.classList.add('active');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            });
        }
    });
}

// ===== MODERN ANIMATIONS =====
function initializeModernAnimations() {
    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Add animate-on-scroll class to elements
    const animateElements = document.querySelectorAll('.card, .section-header, .hero-content');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Keyboard navigation for cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                // Focus first menu item when menu opens
                const firstMenuItem = navMenu.querySelector('a');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            }
        });
    }
}

// Initialize accessibility features
initializeAccessibility();

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.log('An error occurred:', e.error);
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// Export functions for use in other scripts
window.EAACWebsite = {
    showNotification,
    loadCourseData,
    updateCourseCounts,
    debounce
};
