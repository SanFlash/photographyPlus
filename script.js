// Main JavaScript for Photography+ Website
class PhotographyPlus {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all components
        this.initLoader();
        this.initNavigation();
        this.initAnimations();
        this.initGallery();
        this.initTestimonials();
        this.initBooking();
        this.initModal();
        this.initScrollAnimations();
        this.initMouseEffects();
        this.initStatsCounter();
        
        // Initialize admin login
        this.initAdminLogin();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    initLoader() {
        const loader = document.querySelector('.shutter-loader');
        const percentage = document.querySelector('.loading-percentage');
        const mainContent = document.querySelector('.main-content');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Complete loading
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        mainContent.style.opacity = '1';
                        
                        // Animate hero title lines
                        this.animateHeroTitle();
                        
                        // Show viewfinder
                        setTimeout(() => {
                            document.querySelector('.viewfinder-overlay').style.opacity = '1';
                            setTimeout(() => {
                                document.querySelector('.viewfinder-overlay').style.opacity = '0';
                            }, 1000);
                        }, 500);
                    }, 500);
                }, 500);
            }
            percentage.textContent = `${Math.min(100, Math.floor(progress))}%`;
        }, 150);
    }

    initNavigation() {
        const dialOptions = document.querySelectorAll('.dial-option');
        const sections = document.querySelectorAll('.section');
        
        // Set active section based on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            dialOptions.forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('href').substring(1) === current) {
                    option.classList.add('active');
                }
            });
            
            // Update progress ring
            this.updateScrollProgress();
        });
        
        // Smooth scroll for dial options
        dialOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = option.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update active state
                    dialOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                }
            });
        });
    }

    updateScrollProgress() {
        const progressRing = document.querySelector('.focus-ring-progress');
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressRing.style.strokeDasharray = '283';
        progressRing.style.strokeDashoffset = 283 - (283 * scrollPercent / 100);
    }

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Add specific animations based on element
                    if (entry.target.classList.contains('service-card')) {
                        setTimeout(() => {
                            entry.target.style.transform = 'rotateY(0deg)';
                        }, 100);
                    }
                    
                    if (entry.target.classList.contains('gallery-item')) {
                        entry.target.classList.add('loaded');
                    }
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        document.querySelectorAll('.service-card').forEach(el => observer.observe(el));
        document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
    }

    animateHeroTitle() {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 300);
        });
        
        // Animate stats counter
        this.animateStats();
    }

    initGallery() {
        const galleryContainer = document.getElementById('galleryContainer');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const loadMoreBtn = document.getElementById('loadMore');
        const viewButtons = document.querySelectorAll('.view-btn');
        
        // Gallery data
        const galleryItems = [
            { id: 1, category: 'wedding', title: 'Sunset Wedding', description: 'Beach wedding at golden hour' },
            { id: 2, category: 'fashion', title: 'Urban Fashion', description: 'Street style fashion shoot' },
            { id: 3, category: 'corporate', title: 'Tech Conference', description: 'Corporate event coverage' },
            { id: 4, category: 'portrait', title: 'Professional Portrait', description: 'Studio portrait session' },
            { id: 5, category: 'wedding', title: 'Traditional Ceremony', description: 'Cultural wedding traditions' },
            { id: 6, category: 'fashion', title: 'Editorial Shoot', description: 'Magazine editorial' },
            { id: 7, category: 'corporate', title: 'Product Launch', description: 'New product announcement' },
            { id: 8, category: 'portrait', title: 'Family Portrait', description: 'Multi-generational family' },
            { id: 9, category: 'wedding', title: 'Mountain Elopement', description: 'Intimate mountain wedding' },
            { id: 10, category: 'fashion', title: 'Runway Show', description: 'Fashion week coverage' },
        ];
        
        let currentFilter = 'all';
        let currentView = 'masonry';
        let loadedItems = 6;
        
        // Initial render
        this.renderGallery(galleryItems.slice(0, loadedItems));
        
        // Filter functionality
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                
                const filtered = currentFilter === 'all' 
                    ? galleryItems 
                    : galleryItems.filter(item => item.category === currentFilter);
                
                galleryContainer.innerHTML = '';
                this.renderGallery(filtered.slice(0, loadedItems));
            });
        });
        
        // View toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentView = btn.dataset.view;
                
                galleryContainer.className = 'gallery-container';
                galleryContainer.classList.add(currentView + '-view');
            });
        });
        
        // Load more functionality
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.classList.add('loading');
            
            setTimeout(() => {
                loadedItems += 3;
                const filtered = currentFilter === 'all' 
                    ? galleryItems 
                    : galleryItems.filter(item => item.category === currentFilter);
                
                galleryContainer.innerHTML = '';
                this.renderGallery(filtered.slice(0, loadedItems));
                
                loadMoreBtn.classList.remove('loading');
                
                if (loadedItems >= filtered.length) {
                    loadMoreBtn.style.display = 'none';
                }
            }, 1000);
        });
        
        // Add hover tilt effect
        this.initTiltEffect();
    }

    renderGallery(items) {
        const galleryContainer = document.getElementById('galleryContainer');
        
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item reveal';
            galleryItem.dataset.category = item.category;
            
            // Generate random image size for masonry effect
            const heights = [300, 400, 350, 450, 320];
            const randomHeight = heights[Math.floor(Math.random() * heights.length)];
            
            galleryItem.innerHTML = `
                <img src="https://picsum.photos/400/${randomHeight}?random=${item.id}" 
                     alt="${item.title}"
                     loading="lazy">
                <div class="item-overlay">
                    <span class="item-category">${item.category}</span>
                    <h4 class="item-title">${item.title}</h4>
                    <p class="item-description">${item.description}</p>
                </div>
            `;
            
            galleryContainer.appendChild(galleryItem);
            
            // Lazy load image
            const img = galleryItem.querySelector('img');
            img.onload = () => {
                galleryItem.classList.add('loaded');
            };
        });
    }

    initTiltEffect() {
        document.addEventListener('mousemove', (e) => {
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;
                
                item.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.05, 1.05, 1.05)
                `;
            });
        });
        
        // Reset transform when mouse leaves
        document.addEventListener('mouseleave', () => {
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    initTestimonials() {
        const carouselTrack = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        const testimonials = [
            {
                name: 'Sarah Johnson',
                role: 'Wedding Client',
                text: 'The team captured our wedding day perfectly! Every photo tells a story and brings back beautiful memories.',
                avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            {
                name: 'Michael Chen',
                role: 'Corporate Client',
                text: 'Professional, creative, and delivered beyond expectations. Our product launch coverage was exceptional.',
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            {
                name: 'Emma Rodriguez',
                role: 'Fashion Model',
                text: 'Working with Photography+ elevated my portfolio. Their attention to detail is remarkable.',
                avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            {
                name: 'David Wilson',
                role: 'Portrait Client',
                text: 'The family portraits we got are absolutely stunning. They made everyone feel comfortable and natural.',
                avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
            }
        ];
        
        // Render testimonials
        testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.innerHTML = `
                <div class="client-avatar">
                    <img src="${testimonial.avatar}" alt="${testimonial.name}">
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="client-info">
                    <h4 class="client-name">${testimonial.name}</h4>
                    <p class="client-role">${testimonial.role}</p>
                </div>
            `;
            carouselTrack.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });
        
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        let currentSlide = 0;
        
        // Update carousel
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Next slide
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });
        
        // Previous slide
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });
        
        // Dot navigation
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.dataset.index);
                updateCarousel();
            });
        });
        
        // Auto rotate
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }

    initBooking() {
        const bookingForm = document.getElementById('bookingForm');
        const bookButtons = document.querySelectorAll('.btn-book');
        const exploreBtn = document.getElementById('exploreBtn');
        const bookSessionBtn = document.getElementById('bookSession');
        
        // Form submission
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                message: document.getElementById('message').value
            };
            
            // Show success animation
            const submitBtn = bookingForm.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Session Booked!';
            submitBtn.style.background = '#27ae60';
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you! We\'ll contact you within 24 hours to confirm your session.');
                bookingForm.reset();
                submitBtn.innerHTML = `
                    <span>Capture This Moment</span>
                    <div class="shutter-animation">
                        <div class="shutter-blade"></div>
                        <div class="shutter-blade"></div>
                    </div>
                `;
                submitBtn.style.background = '';
            }, 1500);
        });
        
        // Book buttons in service cards
        bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                document.getElementById('service').value = service;
                
                // Scroll to booking section
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Explore gallery button
        exploreBtn.addEventListener('click', () => {
            document.querySelector('#portfolio').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // Book session button
        bookSessionBtn.addEventListener('click', () => {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    initModal() {
        const adminLoginBtn = document.getElementById('adminLogin');
        const adminLoginModal = document.getElementById('adminLoginModal');
        const modalCloseBtns = document.querySelectorAll('.modal-close');
        
        // Admin login modal
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            adminLoginModal.classList.add('active');
        });
        
        // Close modals
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('active');
            });
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    initScrollAnimations() {
        let lastScrollTop = 0;
        const viewfinder = document.querySelector('.viewfinder-overlay');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            // Parallax effect for sections
            document.querySelectorAll('.section').forEach((section, index) => {
                const speed = 0.5;
                const yPos = -(scrollTop * speed);
                section.style.backgroundPositionY = `${yPos}px`;
            });
            
            // Show viewfinder on scroll direction change
            if (Math.abs(scrollTop - lastScrollTop) > 50) {
                viewfinder.style.opacity = '1';
                setTimeout(() => {
                    viewfinder.style.opacity = '0';
                }, 300);
            }
            
            lastScrollTop = scrollTop;
        });
    }

    initMouseEffects() {
        const spotlight = document.querySelector('.cursor-spotlight');
        
        document.addEventListener('mousemove', (e) => {
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
            spotlight.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
        
        // Aperture effect on buttons
        document.querySelectorAll('.btn-aperture, .dial-option').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
        
        // Shutter sound simulation (optional)
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                // Simulate shutter sound effect
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    initStatsCounter() {
        this.animateStats();
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    initAdminLogin() {
        const adminLoginForm = document.getElementById('adminLoginForm');
        
        // Default admin credentials (for demo purposes)
        const ADMIN_CREDENTIALS = {
            username: 'admin',
            password: 'photography2024'
        };
        
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            // Simulate authentication
            if (username === ADMIN_CREDENTIALS.username && 
                password === ADMIN_CREDENTIALS.password) {
                
                // Store session in localStorage
                localStorage.setItem('photography_admin_session', 'true');
                localStorage.setItem('session_expiry', Date.now() + 3600000); // 1 hour
                
                // Show success and redirect
                const submitBtn = adminLoginForm.querySelector('.btn-auth');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Access Granted';
                submitBtn.style.background = '#27ae60';
                
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                // Show error
                const submitBtn = adminLoginForm.querySelector('.btn-auth');
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Invalid Credentials';
                submitBtn.style.background = '#e74c3c';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Access Dashboard</span><i class="fas fa-arrow-right"></i>';
                    submitBtn.style.background = '';
                }, 2000);
            }
        });
    }

    setupEventListeners() {
        // Window load complete
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
        
        // Responsive menu toggle for mobile
        this.initMobileMenu();
        
        // Keyboard shortcuts
        this.initKeyboardShortcuts();
    }

    initMobileMenu() {
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(mobileMenuBtn);
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        
        const menuItems = [
            { href: '#home', icon: 'fa-home', text: 'Home' },
            { href: '#services', icon: 'fa-camera', text: 'Services' },
            { href: '#portfolio', icon: 'fa-images', text: 'Portfolio' },
            { href: '#testimonials', icon: 'fa-comment', text: 'Testimonials' },
            { href: '#contact', icon: 'fa-envelope', text: 'Contact' }
        ];
        
        menuItems.forEach(item => {
            const a = document.createElement('a');
            a.href = item.href;
            a.innerHTML = `<i class="fas ${item.icon}"></i> ${item.text}`;
            mobileMenu.appendChild(a);
        });
        
        document.body.appendChild(mobileMenu);
        
        // Toggle menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = mobileMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Hide/show mobile menu based on screen size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + / for admin login
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                document.getElementById('adminLoginModal').classList.add('active');
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Arrow keys for testimonial carousel
            if (e.key === 'ArrowRight') {
                document.querySelector('.carousel-btn.next').click();
            }
            if (e.key === 'ArrowLeft') {
                document.querySelector('.carousel-btn.prev').click();
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyPlus();
});

// Add mobile menu styles dynamically
const mobileMenuStyles = `
    .mobile-menu-btn {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: var(--secondary);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1001;
        box-shadow: var(--shadow-lg);
    }
    
    .mobile-menu {
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 20px;
        display: none;
        flex-direction: column;
        gap: 15px;
        z-index: 1000;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .mobile-menu.active {
        display: flex;
        transform: translateY(0);
        opacity: 1;
    }
    
    .mobile-menu a {
        display: flex;
        align-items: center;
        gap: 15px;
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 10px;
        transition: all 0.3s ease;
    }
    
    .mobile-menu a:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;

document.head.appendChild(styleSheet);

