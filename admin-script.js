// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.events = [];
        this.galleryItems = [];
        this.notifications = [];
        this.currentTheme = 'darkroom';
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.initEventListeners();
        this.loadDashboardData();
        this.initThemeEditor();
        this.initGalleryManager();
        this.initNotifications();
        this.initLivePreview();
    }

    checkAuth() {
        const session = localStorage.getItem('photography_admin_session');
        const expiry = localStorage.getItem('session_expiry');
        
        if (session === 'true' && expiry && Date.now() < parseInt(expiry)) {
            // Valid session
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            this.currentUser = {
                username: 'admin',
                role: 'Administrator'
            };
            this.updateUI();
        } else {
            // Invalid or expired session
            localStorage.removeItem('photography_admin_session');
            localStorage.removeItem('session_expiry');
            this.showAuthScreen();
        }
    }

    showAuthScreen() {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    initEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.admin-sidebar').classList.toggle('active');
            document.getElementById('menuToggle').classList.toggle('active');
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(link.getAttribute('href').substring(1));
            });
        });

        // Add event button
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.openEventModal();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('active');
            });
        });

        // Event form submission
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });

        // Publish changes
        document.getElementById('publishBtn').addEventListener('click', () => {
            this.publishChanges();
        });

        // Live preview
        document.getElementById('livePreviewBtn').addEventListener('click', () => {
            this.toggleLivePreview();
        });

        // Theme reset
        document.getElementById('resetTheme').addEventListener('click', () => {
            this.resetTheme();
        });

        // Theme save
        document.getElementById('saveTheme').addEventListener('click', () => {
            this.saveTheme();
        });

        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Drag and drop for upload
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3498db';
            uploadArea.style.background = 'rgba(52, 152, 219, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            
            if (e.dataTransfer.files.length) {
                this.handleFileUpload(e.dataTransfer.files);
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Demo authentication
        if (username === 'admin' && password === 'photography2024') {
            // Store session
            localStorage.setItem('photography_admin_session', 'true');
            
            if (remember) {
                localStorage.setItem('session_expiry', Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
            } else {
                localStorage.setItem('session_expiry', Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
            }

            // Show success
            const btn = document.querySelector('.btn-login');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Access Granted';
            btn.style.background = '#27ae60';

            setTimeout(() => {
                this.checkAuth();
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1000);
        } else {
            // Show error
            const btn = document.querySelector('.btn-login');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-times"></i> Invalid Credentials';
            btn.style.background = '#e74c3c';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }
    }

    handleLogout() {
        localStorage.removeItem('photography_admin_session');
        localStorage.removeItem('session_expiry');
        this.showAuthScreen();
    }

    switchSection(sectionId) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');

        // Show selected section
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            document.querySelector('.admin-sidebar').classList.remove('active');
            document.getElementById('menuToggle').classList.remove('active');
        }
    }

    updateUI() {
        // Update current date
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);

        // Update user info
        if (this.currentUser) {
            document.querySelector('.user-name').textContent = this.currentUser.username;
            document.querySelector('.user-role').textContent = this.currentUser.role;
        }
    }

    loadDashboardData() {
        // Load mock data
        this.events = [
            {
                id: 1,
                name: 'Summer Wedding',
                type: 'wedding',
                start: '2024-06-15T14:00',
                end: '2024-06-15T22:00',
                location: 'Beach Resort',
                status: 'upcoming'
            },
            {
                id: 2,
                name: 'Corporate Conference',
                type: 'corporate',
                start: '2024-06-20T09:00',
                end: '2024-06-20T17:00',
                location: 'Convention Center',
                status: 'upcoming'
            }
        ];

        this.galleryItems = [
            { id: 1, name: 'sunset-wedding.jpg', category: 'wedding', size: '2.4MB', date: '2024-05-15' },
            { id: 2, name: 'corporate-event.jpg', category: 'corporate', size: '3.1MB', date: '2024-05-10' },
            { id: 3, name: 'portrait-session.jpg', category: 'portrait', size: '1.8MB', date: '2024-05-05' }
        ];

        this.notifications = [
            {
                id: 1,
                type: 'info',
                title: 'New Booking Request',
                message: 'Sarah Johnson requested a wedding photography session',
                time: '10 minutes ago',
                unread: true
            },
            {
                id: 2,
                type: 'success',
                title: 'Gallery Updated',
                message: 'Summer collection has been published successfully',
                time: '2 hours ago',
                unread: true
            },
            {
                id: 3,
                type: 'warning',
                title: 'Storage Alert',
                message: 'You have used 85% of your storage space',
                time: '1 day ago',
                unread: false
            }
        ];

        // Render data
        this.renderEvents();
        this.renderGallery();
        this.renderActivities();
        this.renderNotifications();
    }

    renderEvents() {
        const container = document.querySelector('.events-container');
        if (!container) return;

        container.innerHTML = `
            <div class="events-list">
                ${this.events.map(event => `
                    <div class="event-card" data-id="${event.id}">
                        <div class="event-header">
                            <h4>${event.name}</h4>
                            <span class="event-type ${event.type}">${event.type}</span>
                        </div>
                        <div class="event-details">
                            <p><i class="fas fa-calendar"></i> ${new Date(event.start).toLocaleDateString()}</p>
                            <p><i class="fas fa-clock"></i> ${new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        </div>
                        <div class="event-actions">
                            <button class="btn-edit" onclick="adminDashboard.editEvent(${event.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="adminDashboard.deleteEvent(${event.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderGallery() {
        const grid = document.getElementById('galleryManagerGrid');
        if (!grid) return;

        grid.innerHTML = this.galleryItems.map(item => `
            <div class="gallery-item" data-id="${item.id}">
                <img src="https://picsum.photos/200/150?random=${item.id}" alt="${item.name}">
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-meta">${item.category} • ${item.size}</p>
                </div>
                <label class="checkbox">
                    <input type="checkbox" class="select-item">
                    <span></span>
                </label>
            </div>
        `).join('');
    }

    renderActivities() {
        const activities = [
            { type: 'upload', text: 'Uploaded 15 photos to Summer Gallery', time: '2 hours ago' },
            { type: 'edit', text: 'Updated wedding photography package', time: '4 hours ago' },
            { type: 'delete', text: 'Removed outdated testimonials', time: '1 day ago' },
            { type: 'upload', text: 'Added new service: Drone Photography', time: '2 days ago' }
        ];

        const container = document.querySelector('.activity-list');
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${activity.type === 'upload' ? 'cloud-upload-alt' : activity.type === 'edit' ? 'edit' : 'trash'}"></i>
                </div>
                <div class="activity-details">
                    <p class="activity-text">${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderNotifications() {
        const container = document.querySelector('.notification-list');
        if (!container) return;

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${notification.type === 'info' ? 'info-circle' : notification.type === 'success' ? 'check-circle' : notification.type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-title">${notification.title}</p>
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            </div>
        `).join('');
    }

    openEventModal() {
        document.getElementById('eventModal').classList.add('active');
    }

    saveEvent() {
        const eventData = {
            id: Date.now(),
            name: document.getElementById('eventName').value,
            type: document.getElementById('eventType').value,
            start: document.getElementById('eventStart').value,
            end: document.getElementById('eventEnd').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            status: 'upcoming'
        };

        this.events.push(eventData);
        this.renderEvents();
        
        // Show notification
        this.addNotification('success', 'Event Created', 'New event has been added successfully');
        
        // Close modal
        document.getElementById('eventModal').classList.remove('active');
        
        // Reset form
        document.getElementById('eventForm').reset();
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Populate form
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventStart').value = event.start;
        document.getElementById('eventEnd').value = event.end;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDescription').value = event.description || '';

        // Update modal title
        document.querySelector('#eventModal h3').textContent = 'Edit Event';
        
        // Update form submission
        const form = document.getElementById('eventForm');
        const originalSubmit = form.onsubmit;
        form.onsubmit = (e) => {
            e.preventDefault();
            
            // Update event
            Object.assign(event, {
                name: document.getElementById('eventName').value,
                type: document.getElementById('eventType').value,
                start: document.getElementById('eventStart').value,
                end: document.getElementById('eventEnd').value,
                location: document.getElementById('eventLocation').value,
                description: document.getElementById('eventDescription').value
            });

            this.renderEvents();
            this.addNotification('success', 'Event Updated', 'Event has been updated successfully');
            document.getElementById('eventModal').classList.remove('active');
            form.onsubmit = originalSubmit;
        };

        document.getElementById('eventModal').classList.add('active');
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.renderEvents();
            this.addNotification('info', 'Event Deleted', 'Event has been removed successfully');
        }
    }

    initThemeEditor() {
        // Preset themes
        document.querySelectorAll('.preset-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.currentTheme = card.dataset.theme;
                this.applyTheme(this.currentTheme);
            });
        });

        // Color pickers
        const colorInputs = ['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor'];
        colorInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                this.updateThemeColor(id, e.target.value);
            });
        });

        // Animation controls
        document.getElementById('animationIntensity').addEventListener('input', (e) => {
            this.updateAnimationIntensity(e.target.value);
        });

        document.getElementById('transitionSpeed').addEventListener('input', (e) => {
            this.updateTransitionSpeed(e.target.value);
        });

        // Toggle switches
        document.getElementById('toggleAnimations').addEventListener('change', (e) => {
            this.toggleAnimations(e.target.checked);
        });

        document.getElementById('toggleDarkMode').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });
    }

    applyTheme(themeName) {
        const themes = {
            darkroom: {
                primary: '#2c3e50',
                secondary: '#e74c3c',
                accent: '#3498db',
                background: '#1a1a2e'
            },
            studio: {
                primary: '#34495e',
                secondary: '#3498db',
                accent: '#9b59b6',
                background: '#2c3e50'
            },
            outdoor: {
                primary: '#27ae60',
                secondary: '#2ecc71',
                accent: '#f1c40f',
                background: '#ecf0f1'
            },
            vintage: {
                primary: '#8B4513',
                secondary: '#D2691E',
                accent: '#DAA520',
                background: '#F5DEB3'
            }
        };

        const theme = themes[themeName];
        if (!theme) return;

        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--admin-${key}`, value);
            document.getElementById(`${key}Color`).value = value;
        });
    }

    updateThemeColor(colorType, value) {
        const cssVar = `--admin-${colorType.replace('Color', '')}`;
        document.documentElement.style.setProperty(cssVar, value);
    }

    updateAnimationIntensity(value) {
        const intensity = value / 100;
        document.documentElement.style.setProperty('--animation-intensity', intensity);
    }

    updateTransitionSpeed(value) {
        document.documentElement.style.setProperty('--transition-speed', `${value}ms`);
    }

    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    resetTheme() {
        this.applyTheme('darkroom');
        document.getElementById('animationIntensity').value = 75;
        document.getElementById('transitionSpeed').value = 500;
        this.updateAnimationIntensity(75);
        this.updateTransitionSpeed(500);
    }

    saveTheme() {
        const theme = {
            primary: document.getElementById('primaryColor').value,
            secondary: document.getElementById('secondaryColor').value,
            accent: document.getElementById('accentColor').value,
            background: document.getElementById('backgroundColor').value,
            animationIntensity: document.getElementById('animationIntensity').value,
            transitionSpeed: document.getElementById('transitionSpeed').value
        };

        localStorage.setItem('photography_theme', JSON.stringify(theme));
        this.addNotification('success', 'Theme Saved', 'Theme settings have been saved successfully');
    }

    initGalleryManager() {
        // Select all
        document.getElementById('selectAll').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.select-item');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            
            checkboxes.forEach(cb => {
                cb.checked = !allChecked;
                cb.closest('.gallery-item').classList.toggle('selected', !allChecked);
            });
        });

        // Delete selected
        document.getElementById('deleteSelected').addEventListener('click', () => {
            const selectedItems = Array.from(document.querySelectorAll('.select-item:checked'))
                .map(cb => cb.closest('.gallery-item').dataset.id);
            
            if (selectedItems.length === 0) {
                alert('Please select items to delete');
                return;
            }

            if (confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
                this.galleryItems = this.galleryItems.filter(item => 
                    !selectedItems.includes(item.id.toString())
                );
                this.renderGallery();
                this.addNotification('info', 'Items Deleted', `${selectedItems.length} items have been removed`);
            }
        });

        // Item selection
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('select-item')) {
                e.target.closest('.gallery-item').classList.toggle('selected', e.target.checked);
            }
        });
    }

    handleFileUpload(files) {
        if (files.length === 0) return;

        const uploadArea = document.getElementById('uploadArea');
        const originalContent = uploadArea.innerHTML;
        
        uploadArea.innerHTML = `
            <div class="upload-progress">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Uploading ${files.length} file(s)...</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;

        let uploadedCount = 0;
        
        Array.from(files).forEach((file, index) => {
            // Simulate upload progress
            setTimeout(() => {
                if (file.type.startsWith('image/')) {
                    // Add to gallery items
                    this.galleryItems.unshift({
                        id: Date.now() + index,
                        name: file.name,
                        category: 'uncategorized',
                        size: this.formatFileSize(file.size),
                        date: new Date().toISOString().split('T')[0]
                    });
                    
                    uploadedCount++;
                    
                    // Update progress
                    const progress = (uploadedCount / files.length) * 100;
                    const progressFill = uploadArea.querySelector('.progress-fill');
                    if (progressFill) {
                        progressFill.style.width = `${progress}%`;
                    }
                    
                    // Complete
                    if (uploadedCount === files.length) {
                        setTimeout(() => {
                            uploadArea.innerHTML = originalContent;
                            this.renderGallery();
                            this.addNotification('success', 'Upload Complete', `${files.length} image(s) uploaded successfully`);
                        }, 500);
                    }
                }
            }, index * 500);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    initLivePreview() {
        document.getElementById('openFullPreview').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });
    }

    toggleLivePreview() {
        const previewBtn = document.getElementById('livePreviewBtn');
        previewBtn.classList.toggle('active');
        
        if (previewBtn.classList.contains('active')) {
            previewBtn.innerHTML = '<i class="fas fa-eye-slash"></i><span>Hide Preview</span>';
            // Show preview panel
        } else {
            previewBtn.innerHTML = '<i class="fas fa-eye"></i><span>Live Preview</span>';
            // Hide preview panel
        }
    }

    publishChanges() {
        // Simulate publishing
        const btn = document.getElementById('publishBtn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Publishing...</span>';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i><span>Published!</span>';
            btn.style.background = '#27ae60';
            
            this.addNotification('success', 'Changes Published', 'All changes have been published to live site');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        }, 1500);
    }

    addNotification(type, title, message) {
        const notification = {
            id: Date.now(),
            type,
            title,
            message,
            time: 'Just now',
            unread: true
        };
        
        this.notifications.unshift(notification);
        this.renderNotifications();
        
        // Show notification center
        const center = document.getElementById('notificationCenter');
        center.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            center.style.display = 'none';
        }, 5000);
    }

    initNotifications() {
        const center = document.getElementById('notificationCenter');
        const clearBtn = center.querySelector('.btn-clear');
        
        // Clear all notifications
        clearBtn.addEventListener('click', () => {
            this.notifications = [];
            this.renderNotifications();
        });
        
        // Mark as read on click
        center.addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            if (item) {
                const id = parseInt(item.dataset.id);
                const notification = this.notifications.find(n => n.id === id);
                if (notification) {
                    notification.unread = false;
                    item.classList.remove('unread');
                }
            }
        });
    }

    handleResize() {
        if (window.innerWidth > 1024) {
            document.querySelector('.admin-sidebar').classList.remove('active');
            document.getElementById('menuToggle').classList.remove('active');
        }
    }
}

// Initialize admin dashboard
let adminDashboard;

document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});

// Make available globally
window.adminDashboard = adminDashboard;