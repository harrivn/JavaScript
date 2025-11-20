// ==================== UTILITY FUNCTIONS ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== DATA ====================
const toursData = [
  {
    id: 1,
    location: "PARIS, FRANCE",
    title: "Eiffel Tower & Seine River Cruise",
    price: "$899",
    rating: 5,
    image: "/figma25/picture/h1.jpg"
  },
  {
    id: 2,
    location: "TOKYO, JAPAN",
    title: "Cherry Blossom & Temple Tour",
    price: "$1,299",
    rating: 5,
    image: "/figma25/picture/h2.webp"
  },
  {
    id: 3,
    location: "BALI, INDONESIA",
    title: "Tropical Beach Paradise",
    price: "$749",
    rating: 4,
    image: "/figma25/picture/3.jpg"
  },
  {
    id: 4,
    location: "ROME, ITALY",
    title: "Ancient Colosseum Experience",
    price: "$999",
    rating: 5,
    image: "/figma25/picture/4.jpg"
  },
  {
    id: 5,
    location: "SANTORINI, GREECE",
    title: "Sunset in White & Blue",
    price: "$1,099",
    rating: 5,
    image: "/figma25/picture/5.jpg"
  },
  {
    id: 6,
    location: "DUBAI, UAE",
    title: "Desert Safari & Burj Khalifa",
    price: "$1,499",
    rating: 5,
    image: "/figma25/picture/6.jpg"
  },
  {
    id: 7,
    location: "MALDIVES",
    title: "Overwater Villa Retreat",
    price: "$2,299",
    rating: 5,
    image: "/figma25/picture/7.jpg"
  },
  {
    id: 8,
    location: "NEW YORK, USA",
    title: "City That Never Sleeps",
    price: "$849",
    rating: 4,
    image: "/figma25/picture/8.jpg"
  }
];



const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Southeast Asia",
    excerpt: "Discover the most beautiful undiscovered destinations that will take your breath away...",
    date: "Nov 10, 2025",
    category: "Travel Tips"
  },
  {
    id: 2,
    title: "How to Pack Light for Long Trips",
    excerpt: "Master the art of minimalist packing with our expert tips and tricks...",
    date: "Nov 8, 2025",
    category: "Travel Guides"
  },
  {
    id: 3,
    title: "Best Photography Spots Around the World",
    excerpt: "Capture Instagram-worthy moments at these stunning locations...",
    date: "Nov 5, 2025",
    category: "Photography"
  }
];

// ==================== STATE MANAGEMENT ====================
let currentUser = null;
let currentTourIndex = 0;
let favorites = [];

// ==================== AUTHENTICATION ====================
class AuthManager {
  constructor() {
    this.users = this.loadUsers();
    this.checkSession();
  }

  loadUsers() {
    const stored = localStorage.getItem('travel_users');
    return stored ? JSON.parse(stored) : [];
  }

  saveUsers() {
    localStorage.setItem('travel_users', JSON.stringify(this.users));
  }

  register(email, password, name) {
    if (this.users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const user = {
      id: Date.now(),
      email,
      password: btoa(password), // Basic encoding (use proper hashing in production)
      name,
      createdAt: new Date().toISOString()
    };

    this.users.push(user);
    this.saveUsers();
    return { success: true, message: 'Registration successful!' };
  }

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === btoa(password));
    
    if (user) {
      currentUser = { ...user };
      delete currentUser.password;
      localStorage.setItem('current_user', JSON.stringify(currentUser));
      return { success: true, user: currentUser };
    }
    
    return { success: false, message: 'Invalid credentials' };
  }

  logout() {
    currentUser = null;
    localStorage.removeItem('current_user');
    updateUIForAuth();
  }

  checkSession() {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      updateUIForAuth();
    }
  }
}

const auth = new AuthManager();

// ==================== MODAL MANAGEMENT ====================
function showLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'secret-modal';
  modal.innerHTML = `
    <div class="secret-content" style="max-width: 400px; width: 90%;">
      <h2 style="margin-bottom: 1.5rem; color: #ec4899;">Welcome Back</h2>
      <form id="loginForm" style="display: flex; flex-direction: column; gap: 1rem;">
        <input type="email" id="loginEmail" placeholder="Email" required 
          style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem;">
        <input type="password" id="loginPassword" placeholder="Password" required
          style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem;">
        <button type="submit" class="btn-register" style="width: 100%; margin-top: 0.5rem;">
          Login
        </button>
        <button type="button" id="switchToRegister" style="background: none; border: none; color: #6366f1; cursor: pointer;">
          Don't have an account? Register
        </button>
        <button type="button" id="closeModal" style="background: none; border: none; color: #666; cursor: pointer; margin-top: 0.5rem;">
          Close
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value;
    const password = $('#loginPassword').value;
    
    const result = auth.login(email, password);
    
    if (result.success) {
      alert('Login successful! Welcome, ' + result.user.name);
      modal.remove();
      updateUIForAuth();
    } else {
      alert(result.message);
    }
  });

  $('#switchToRegister').addEventListener('click', () => {
    modal.remove();
    showRegisterModal();
  });

  $('#closeModal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function showRegisterModal() {
  const modal = document.createElement('div');
  modal.className = 'secret-modal';
  modal.innerHTML = `
    <div class="secret-content" style="max-width: 400px; width: 90%;">
      <h2 style="margin-bottom: 1.5rem; color: #ec4899;">Create Account</h2>
      <form id="registerForm" style="display: flex; flex-direction: column; gap: 1rem;">
        <input type="text" id="registerName" placeholder="Full Name" required
          style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem;">
        <input type="email" id="registerEmail" placeholder="Email" required
          style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem;">
        <input type="password" id="registerPassword" placeholder="Password" required
          style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem;">
        <button type="submit" class="btn-register" style="width: 100%; margin-top: 0.5rem;">
          Register
        </button>
        <button type="button" id="switchToLogin" style="background: none; border: none; color: #6366f1; cursor: pointer;">
          Already have an account? Login
        </button>
        <button type="button" id="closeModal" style="background: none; border: none; color: #666; cursor: pointer; margin-top: 0.5rem;">
          Close
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  $('#registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#registerName').value;
    const email = $('#registerEmail').value;
    const password = $('#registerPassword').value;
    
    const result = auth.register(email, password, name);
    
    if (result.success) {
      alert(result.message + ' Please login now.');
      modal.remove();
      showLoginModal();
    } else {
      alert(result.message);
    }
  });

  $('#switchToLogin').addEventListener('click', () => {
    modal.remove();
    showLoginModal();
  });

  $('#closeModal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function updateUIForAuth() {
  const authButtons = $('.nav-auth-buttons');
  if (!authButtons) return;

  if (currentUser) {
    authButtons.innerHTML = `
      <span style="margin-right: 1rem; color: #666;">Hello, ${currentUser.name}</span>
      <button class="btn-login" id="logoutBtn">Logout</button>
    `;
    $('#logoutBtn').addEventListener('click', () => {
      auth.logout();
      alert('Logged out successfully');
    });
  } else {
    authButtons.innerHTML = `
      <button class="btn-register" id="registerBtn">Register</button>
      <button class="btn-login" id="loginBtn">Login</button>
    `;
    $('#registerBtn')?.addEventListener('click', showRegisterModal);
    $('#loginBtn')?.addEventListener('click', showLoginModal);
  }
}

// ==================== NAVIGATION ====================
function initNavigation() {
  const navLinks = $$('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.textContent.toLowerCase();
      scrollToSection(target);
      
      // Update active link
      navLinks.forEach(l => l.style.color = '#666');
      link.style.color = '#ec4899';
    });
  });

  // Logo click - scroll to top
  $('.logo')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function scrollToSection(section) {
  const sections = {
    'home': '.hero',
    'about': '.about',
    'tours': '.tours',
    'discount': '.tours',
    'blog': '.testimonials',
    'contact': 'footer'
  };

  const target = $(sections[section] || '.hero');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==================== TOURS FUNCTIONALITY ====================
function initTours() {
  renderTours();
  
  // Navigation buttons
  $('.nav-btn:first-child')?.addEventListener('click', () => {
    currentTourIndex = Math.max(0, currentTourIndex - 4);
    renderTours();
  });

  $('.nav-btn:last-child')?.addEventListener('click', () => {
    currentTourIndex = Math.min(toursData.length - 4, currentTourIndex + 4);
    renderTours();
  });
}

function renderTours() {
  const grid = $('.tours-grid');
  if (!grid) return;

  const visibleTours = toursData.slice(currentTourIndex, currentTourIndex + 4);
  
  grid.innerHTML = visibleTours.map(tour => `
    <div class="tour-card" data-tour-id="${tour.id}">
      <div class="tour-image" style="background-image: url('${tour.image}'); background-size: cover; background-position: center;"></div>
      <div class="tour-content">
        <div class="tour-location">${tour.location}</div>
        <div class="tour-title">${tour.title}</div>
        <div class="tour-footer">
          <span class="tour-price">${tour.price}</span>
          <span class="stars">${'⭐'.repeat(tour.rating)}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Add click handlers
  $$('.tour-card').forEach(card => {
    card.addEventListener('click', () => {
      const tourId = card.dataset.tourId;
      showTourDetails(tourId);
    });
  });
}

function showTourDetails(tourId) {
  const tour = toursData.find(t => t.id == tourId);
  if (!tour) return;

  const modal = document.createElement('div');
  modal.className = 'secret-modal';
  modal.innerHTML = `
    <div class="secret-content" style="max-width: 500px; width: 90%;">
      <div style="background-image: url('${tour.image}'); background-size: cover; background-position: center; height: 200px; margin: -3rem -3rem 2rem; border-radius: 1rem 1rem 0 0;"></div>
      <h2 style="color: #ec4899; margin-bottom: 0.5rem;">${tour.title}</h2>
      <p style="color: #666; margin-bottom: 1rem;">${tour.location}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <span style="font-size: 2rem; font-weight: bold; color: #ec4899;">${tour.price}</span>
        <span style="font-size: 1.5rem;">${'⭐'.repeat(tour.rating)}</span>
      </div>
      <p style="color: #666; line-height: 1.8; margin-bottom: 2rem;">
        Experience the magic of ${tour.location.split(',')[0]} with our expertly curated tour package. 
        Includes accommodation, guided tours, and unforgettable memories.
      </p>
      <button class="btn-register" style="width: 100%;" id="bookNow">Book Now</button>
      <button id="closeModal" style="background: none; border: none; color: #666; cursor: pointer; margin-top: 1rem; width: 100%;">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  $('#bookNow').addEventListener('click', () => {
    if (currentUser) {
      alert('Booking confirmed! We\'ll contact you shortly at ' + currentUser.email);
      modal.remove();
    } else {
      modal.remove();
      showLoginModal();
    }
  });

  $('#closeModal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ==================== TESTIMONIALS ====================
function renderTestimonials() {
  const grid = $('.testimonials-grid');
  if (!grid) return;

  grid.innerHTML = testimonialsData.map(testimonial => `
    <div class="testimonial-card">
      <div class="quote-mark">"</div>
      <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.8;">${testimonial.text}</p>
      <div class="testimonial-header">
        <div class="avatar">${testimonial.avatar}</div>
        <div>
          <div style="font-weight: 600;">${testimonial.name}</div>
          <div style="color: #999; font-size: 0.9rem;">${testimonial.location}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ==================== SEARCH FUNCTIONALITY ====================
function initSearch() {
  const searchBtn = $('.btn-search');
  
  searchBtn?.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'secret-modal';
    modal.innerHTML = `
      <div class="secret-content" style="max-width: 600px; width: 90%;">
        <h2 style="margin-bottom: 2rem; color: #ec4899;">Search Results</h2>
        <div id="searchResults" style="max-height: 400px; overflow-y: auto;">
          ${toursData.map(tour => `
            <div style="padding: 1rem; border-bottom: 1px solid #eee; cursor: pointer;" class="search-result" data-tour-id="${tour.id}">
              <div style="font-weight: 600; margin-bottom: 0.5rem;">${tour.title}</div>
              <div style="color: #666; font-size: 0.9rem;">${tour.location} - ${tour.price}</div>
            </div>
          `).join('')}
        </div>
        <button id="closeModal" style="background: none; border: none; color: #666; cursor: pointer; margin-top: 1rem;">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    $$('.search-result').forEach(result => {
      result.addEventListener('click', () => {
        const tourId = result.dataset.tourId;
        modal.remove();
        showTourDetails(tourId);
      });
    });

    $('#closeModal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  });
}

// ==================== EASTER EGGS ====================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function initEasterEggs() {
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
      activateKonamiCode();
    }
  });

  // Triple click on logo
  let logoClicks = 0;
  $('.logo')?.addEventListener('click', () => {
    logoClicks++;
    setTimeout(() => logoClicks = 0, 1000);
    
    if (logoClicks === 3) {
      showSecretDiscount();
    }
  });
}

function activateKonamiCode() {
  const emoji = document.createElement('div');
  emoji.className = 'konami-active';
  emoji.textContent = '🎉';
  document.body.appendChild(emoji);

  setTimeout(() => emoji.remove(), 3000);
  
  alert('🎊 Konami Code Activated! You unlocked 50% off all tours! 🎊');
}

function showSecretDiscount() {
  const modal = document.createElement('div');
  modal.className = 'secret-modal';
  modal.innerHTML = `
    <div class="secret-content">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">🎁</h1>
      <h2 style="color: #ec4899; margin-bottom: 1rem;">Secret Discount Unlocked!</h2>
      <p style="font-size: 1.5rem; font-weight: bold; color: #6366f1; margin-bottom: 1rem;">
        TRAVEL2025
      </p>
      <p style="color: #666;">Use this code for 30% off your next booking!</p>
      <button id="closeModal" class="btn-register" style="margin-top: 2rem;">
        Claim Discount
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  $('#closeModal').addEventListener('click', () => {
    modal.remove();
    alert('Discount code copied! TRAVEL2025');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ==================== ANIMATIONS ====================
function initAnimations() {
  // Smooth scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  $$('.tour-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌍 Travel Website Initialized');
  
  updateUIForAuth();
  initNavigation();
  initTours();
  renderTestimonials();
  initSearch();
  initEasterEggs();
  initAnimations();

  // Stats counter animation
  $$('.stat-number').forEach(stat => {
    const target = parseInt(stat.textContent.replace(/\D/g, ''));
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target + (stat.textContent.includes('K') ? 'K+' : '+');
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(current) + (stat.textContent.includes('K') ? 'K+' : '+');
      }
    }, 30);
  });
});

// ==================== CONTACT FORM ====================
function initContactForm() {
  // If you add a contact form to your HTML, this will handle it
  const contactForm = $('#contactForm');
  
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login to send a message');
      showLoginModal();
      return;
    }

    const formData = new FormData(contactForm);
    alert(`Thank you for your message, ${currentUser.name}! We'll respond to ${currentUser.email} soon.`);
    contactForm.reset();
  });
}

// ==================== BLOG FUNCTIONALITY ====================
function showBlogSection() {
  const modal = document.createElement('div');
  modal.className = 'secret-modal';
  modal.innerHTML = `
    <div class="secret-content" style="max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
      <h2 style="color: #ec4899; margin-bottom: 2rem;">Travel Blog</h2>
      <div style="display: grid; gap: 1.5rem;">
        ${blogPosts.map(post => `
          <div style="background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: #ec4899; font-size: 0.8rem; font-weight: 600;">${post.category}</span>
              <span style="color: #999; font-size: 0.8rem;">${post.date}</span>
            </div>
            <h3 style="margin-bottom: 0.5rem;">${post.title}</h3>
            <p style="color: #666; line-height: 1.6;">${post.excerpt}</p>
          </div>
        `).join('')}
      </div>
      <button id="closeModal" class="btn-register" style="width: 100%; margin-top: 2rem;">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  $('#closeModal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Export for use in HTML
window.TravelSite = {
  showLoginModal,
  showRegisterModal,
  showBlogSection,
  scrollToSection
};