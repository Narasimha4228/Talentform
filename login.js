function validateLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(elem => {
        elem.style.display = 'none';
    });

    // Email validation
    if (!isValidEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Password validation
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Add animation to button
        const button = document.querySelector('.auth-btn');
        button.innerHTML = 'Logging in...';
        button.style.opacity = '0.8';
        
        // Simulate API call
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    return false; // Prevent form submission
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add input animations
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});