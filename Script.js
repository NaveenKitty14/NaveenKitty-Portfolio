// Global Variables
let isMenuOpen = false;
let currentTheme = localStorage.getItem('theme') || 'light';

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeTabs();
    initializeTypingEffect();
});

// Theme Functions
function initializeTheme() {
    // Set initial theme
    document.body.className = currentTheme + '-mode';
    updateThemeIcon();
    
    // Theme toggle event
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme + '-mode';
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon() {
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    isMenuOpen = false;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
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

// Scroll Effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        
        // Navbar scroll effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/hide scroll to top button
        if (scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate);
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-category')) {
                    setTimeout(() => {
                        animateSkillBars(entry.target);
                    }, 300);
                }
                
                // Special handling for counters
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll(`
        .fade-in, .slide-in-left, .slide-in-right, 
        .about-card, .skill-category, .project-card, 
        .timeline-item, .education-card, .certification-card,
        .contact-item, .counter
    `);
    
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

// Skill Bar Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
    });
}

function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.width = width + '%';
        }, index * 100);
    });
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Tab Functions
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Contact Form
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (validateForm(data)) {
            submitForm(data);
        }
    });
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push({ field: 'name', message: 'Name is required' });
    }
    
    if (!data.email.trim()) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!data.subject.trim()) {
        errors.push({ field: 'subject', message: 'Subject is required' });
    }
    
    if (!data.message.trim()) {
        errors.push({ field: 'message', message: 'Message is required' });
    }
    
    if (errors.length > 0) {
        displayFormErrors(errors);
        return false;
    }
    
    return true;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    switch (fieldName) {
        case 'name':
            isValid = value.length > 0;
            message = 'Name is required';
            break;
        case 'email':
            isValid = value.length > 0 && isValidEmail(value);
            message = value.length > 0 ? 'Please enter a valid email address' : 'Email is required';
            break;
        case 'subject':
            isValid = value.length > 0;
            message = 'Subject is required';
            break;
        case 'message':
            isValid = value.length > 0;
            message = 'Message is required';
            break;
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error-color)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error-color);
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-xs);
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = 'var(--border-color)';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function displayFormErrors(errors) {
    errors.forEach(error => {
        const field = contactForm.querySelector(`[name="${error.field}"]`);
        if (field) {
            showFieldError(field, error.message);
        }
    });
    
    showNotification('Please correct the errors and try again.', 'error');
}

function submitForm(data) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        // Success
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Clear any field errors
        const errorDivs = contactForm.querySelectorAll('.field-error');
        errorDivs.forEach(div => div.remove());
        
        const fields = contactForm.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.style.borderColor = 'var(--border-color)';
        });
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Typing Effect
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-subtitle.subtitle-line');
    if (heroTitle) {
        const originalText = heroTitle.getAttribute('data-text') || heroTitle.textContent;
        heroTitle.setAttribute('data-text', originalText);
        runTypingLoop(heroTitle, originalText, 100, 2000);
    }
}

function runTypingLoop(element, text, speed = 100, pause = 2000) {
    function typeWriter(i = 0) {
        if (i === 0) {
            element.textContent = '';
        }
        if (i < text.length) {
            element.textContent += text.charAt(i);
            setTimeout(() => typeWriter(i + 1), speed);
        } else {
            // Blinking cursor
            element.style.borderRight = '3px solid var(--primary-color)';
            element.style.animation = 'blink 1s infinite';
            setTimeout(() => {
                element.style.borderRight = 'none';
                element.style.animation = 'none';
                setTimeout(() => typeWriter(0), pause);
            }, pause);
        }
    }
    typeWriter();
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function downloadResume() {
    const link = document.createElement('a');
    link.href = `./assets/Resume.pdf`;
    link.download = 'Naveen Prasath Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Resume download started!', 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-text">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        min-width: 300px;
        padding: 16px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    return icons[type] || icons.info;
}

// Lazy Loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Parallax Effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero-shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Performance Optimization
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeParallax();
    
    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll(`
        .about-card, .skill-category, .project-card, 
        .timeline-item, .education-card, .certification-card,
        .contact-item
    `);
    
    animateElements.forEach(element => {
        element.classList.add('fade-in');
    });
});

// Add CSS animations via JavaScript
const animationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes blink {
        0%, 50% { border-color: var(--primary-color); }
        51%, 100% { border-color: transparent; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-icon {
        font-size: 20px;
        opacity: 0.9;
    }
    
    .notification-text {
        flex: 1;
    }
    
    .notification-message {
        font-size: 14px;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        transition: background 0.3s ease;
        opacity: 0.7;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
        opacity: 1;
    }
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Service Worker Registration (Optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
