// This file provides initial mock data for the application
// In a real application, this would be replaced with a backend API

const StudioData = {
    // Initial services data
    services: [
        {
            id: 1,
            title: "Wedding Photography",
            description: "Capture your special day with our expert wedding photography team. Includes pre-wedding consultation, full-day coverage, and professionally edited high-resolution images.",
            price: 2500,
            icon: "fas fa-heart",
            duration: "Full day",
            deliverables: ["500+ edited photos", "Online gallery", "Print release"]
        },
        {
            id: 2,
            title: "Portrait Sessions",
            description: "Professional portrait photography for individuals, couples, and families. Perfect for professional headshots, family portraits, or personal branding.",
            price: 500,
            icon: "fas fa-user",
            duration: "2 hours",
            deliverables: ["50 edited photos", "Online gallery", "Print release"]
        },
        {
            id: 3,
            title: "Fashion Photography",
            description: "High-fashion editorial and commercial photography services for models, designers, and brands. Includes creative direction and professional lighting setup.",
            price: 1500,
            icon: "fas fa-tshirt",
            duration: "4 hours",
            deliverables: ["100+ edited photos", "Creative direction", "Model releases"]
        },
        {
            id: 4,
            title: "Event Coverage",
            description: "Comprehensive event photography for corporate events, parties, and special occasions. Candid and posed shots to capture all the important moments.",
            price: 800,
            icon: "fas fa-calendar-alt",
            duration: "3 hours",
            deliverables: ["200+ edited photos", "Online gallery", "Quick turnaround"]
        }
    ],

    // Initial gallery data
    gallery: [
        {
            id: 1,
            title: "Golden Hour Portrait",
            category: "portrait",
            image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&auto=format&fit=crop",
            description: "Beautiful portrait captured during golden hour with natural lighting."
        },
        {
            id: 2,
            title: "Romantic Wedding",
            category: "wedding",
            image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop",
            description: "Elegant wedding ceremony captured with emotional depth."
        },
        {
            id: 3,
            title: "Urban Fashion",
            category: "fashion",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop",
            description: "Urban fashion shoot featuring street style and modern aesthetics."
        },
        {
            id: 4,
            title: "Corporate Gala",
            category: "events",
            image: "https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?w=800&auto=format&fit=crop",
            description: "Corporate event coverage capturing networking and presentations."
        },
        {
            id: 5,
            title: "Family Portraits",
            category: "portrait",
            image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop",
            description: "Warm family portraits in a natural outdoor setting."
        },
        {
            id: 6,
            title: "Beach Wedding",
            category: "wedding",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop",
            description: "Dreamy beach wedding with sunset backdrop."
        }
    ],

    // Initial testimonials data
    testimonials: [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Bride",
            content: "The Photography+ team captured our wedding perfectly! Every moment was beautifully preserved with such artistry and attention to detail. We'll cherish these photos forever.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Business Owner",
            content: "Professional, creative, and punctual. Our corporate event coverage was exceptional. The team understood exactly what we needed and delivered beyond expectations.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
            rating: 5
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Fashion Model",
            content: "Working with Photography+ was transformative. Their understanding of light, composition, and fashion aesthetics is unparalleled. The portfolio they created launched my career.",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop",
            rating: 5
        }
    ],

    // Initial events data
    events: [
        {
            id: 1,
            title: "Summer Fashion Shoot",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Central Park",
            description: "Outdoor fashion photography session featuring summer collections",
            status: "upcoming"
        },
        {
            id: 2,
            title: "Corporate Event Coverage",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Grand Hotel",
            description: "Annual company event photography and videography",
            status: "confirmed"
        }
    ]
};

// Export data for use in the application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudioData;
} else {
    window.StudioData = StudioData;
}