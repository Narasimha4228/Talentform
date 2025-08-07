// Authentication functions
class AuthService {
    // Simulated user database
    static users = JSON.parse(localStorage.getItem('socialSentimentUsers')) || [];
    
    // Register new user
    static register(userData) {
        return new Promise((resolve, reject) => {
            // Check if user already exists
            const userExists = this.users.some(user => user.email === userData.email);
            if (userExists) {
                reject('User with this email already exists');
                return;
            }
            
            // Add new user (in a real app, you would hash the password)
            this.users.push(userData);
            localStorage.setItem('socialSentimentUsers', JSON.stringify(this.users));
            
            // Simulate API delay
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        name: userData.name,
                        email: userData.email,
                        socialAccounts: userData.socialAccounts || []
                    }
                });
            }, 1000);
        });
    }
    
    // Login user
    static login(email, password) {
        return new Promise((resolve, reject) => {
            // Find user (in a real app, you would verify hashed password)
            const user = this.users.find(u => u.email === email && u.password === password);
            
            // Simulate API delay
            setTimeout(() => {
                if (user) {
                    resolve({
                        success: true,
                        user: {
                            id: user.id || Date.now(),
                            name: user.name,
                            email: user.email,
                            socialAccounts: user.socialAccounts || []
                        }
                    });
                } else {
                    reject('Invalid email or password');
                }
            }, 1000);
        });
    }
    
    // Social login
    static socialLogin(provider) {
        return new Promise((resolve) => {
            // Simulate social login API call
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        name: `Social User ${Math.floor(Math.random() * 1000)}`,
                        email: `social${Math.floor(Math.random() * 1000)}@example.com`,
                        socialAccounts: [provider]
                    }
                });
            }, 1500);
        });
    }
    
    // Check if user is authenticated
    static isAuthenticated() {
        return localStorage.getItem('socialSentimentAuthToken') !== null;
    }
    
    // Store session
    static storeSession(user) {
        localStorage.setItem('socialSentimentAuthToken', JSON.stringify(user));
    }
    
    // Get current user
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('socialSentimentAuthToken'));
    }
    
    // Logout
    static logout() {
        localStorage.removeItem('socialSentimentAuthToken');
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            try {
                const response = await AuthService.login(email, password);
                if (response.success) {
                    AuthService.storeSession(response.user);
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert(error);
            }
        });
    }
    
    // Handle registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Get selected social accounts
            const socialCheckboxes = document.querySelectorAll('input[name="social"]:checked');
            const socialAccounts = Array.from(socialCheckboxes).map(cb => cb.value);
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const response = await AuthService.register({
                    name,
                    email,
                    password, // In real app, hash this password
                    socialAccounts
                });
                
                if (response.success) {
                    AuthService.storeSession(response.user);
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert(error);
            }
        });
    }
    
    // Handle social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const provider = this.classList.contains('google-btn') ? 'google' : 'facebook';
            
            try {
                const response = await AuthService.socialLogin(provider);
                if (response.success) {
                    AuthService.storeSession(response.user);
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('Social login failed: ' + error);
            }
        });
    });
    
    // Update user profile in index.html if logged in
    const userProfile = document.querySelector('.user-profile');
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');
    if (userProfile && userName && userRole) {
        const user = AuthService.getCurrentUser();
        if (user) {
            userName.textContent = user.name || user.username || user.email;
            userRole.textContent = user.email;
            // Optionally update avatar if you store it
        }
    }
});

// Check authentication on dashboard pages
function checkAuth() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Logout functionality
function logout() {
    AuthService.logout();
    window.location.href = 'login.html';
}