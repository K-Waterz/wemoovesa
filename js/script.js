// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Header Scroll Effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
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
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn?.classList.add('visible');
    } else {
        backToTopBtn?.classList.remove('visible');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Quote Form Handling
const quoteForm = document.getElementById('quoteForm');
const formMessage = document.getElementById('formMessage');

if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateQuoteForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showFormMessage('success', 'Thank you! We\'ve received your quote request and will get back to you within 24 hours.');
            quoteForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
    });
}

function validateQuoteForm(data) {
    if (!data.moveType || !data.fromAddress || !data.toAddress || !data.moveDate || 
        !data.fullName || !data.phone || !data.email) {
        showFormMessage('error', 'Please fill in all required fields.');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('error', 'Please enter a valid email address.');
        return false;
    }
    
    // Validate date (should be in the future)
    const moveDate = new Date(data.moveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (moveDate < today) {
        showFormMessage('error', 'Please select a future date for your move.');
        return false;
    }
    
    return true;
}

function showFormMessage(type, message) {
    if (formMessage) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.contactName || !data.contactEmail || !data.contactSubject || !data.contactMessage) {
            showContactFormMessage('error', 'Please fill in all required fields.');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.contactEmail)) {
            showContactFormMessage('error', 'Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showContactFormMessage('success', 'Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Scroll to message
            contactFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
    });
}

function showContactFormMessage(type, message) {
    if (contactFormMessage) {
        contactFormMessage.className = `form-message ${type}`;
        contactFormMessage.textContent = message;
        contactFormMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            contactFormMessage.style.display = 'none';
        }, 5000);
    }
}

// Set minimum date for move date input to today
const moveDateInput = document.getElementById('moveDate');
if (moveDateInput) {
    const today = new Date().toISOString().split('T')[0];
    moveDateInput.setAttribute('min', today);
}

// Animate elements on scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .process-step');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Activate nav link on page load
    activateNavLink();
});
