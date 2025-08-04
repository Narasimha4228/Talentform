// User Profile Sync Script for SocialSentiment
// This script updates the header user profile (avatar, name, email) on every page based on localStorage login data.
document.addEventListener('DOMContentLoaded', function() {
    let user = null;
    if (localStorage.getItem('socialSentimentAuthToken')) {
        user = JSON.parse(localStorage.getItem('socialSentimentAuthToken'));
    }
    const headerAvatar = document.querySelector('.user-profile .user-avatar');
    const headerName = document.querySelector('.user-profile .user-name');
    const headerRole = document.querySelector('.user-profile .user-role');
    if (user) {
        if (headerAvatar) headerAvatar.src = user.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg';
        if (headerName) headerName.textContent = user.name || user.username || user.email || '';
        if (headerRole) headerRole.textContent = user.email || '';
    } else {
        if (headerAvatar) headerAvatar.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
        if (headerName) headerName.textContent = '';
        if (headerRole) headerRole.textContent = '';
    }
    // Logout button (if present)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('socialSentimentAuthToken');
            window.location.href = 'login.html';
        });
    }
    // Action buttons for alert/primary cards
    document.querySelectorAll('.alert-actions .btn-primary, .stat-actions .btn-primary, .card-actions .btn-primary').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.alert-card, .stat-card, .card');
            if (!card) return;
            const title = card.querySelector('.alert-title, .stat-title, .card-title')?.textContent.trim();
            const content = card.querySelector('.alert-content, .stat-content, .card-content')?.textContent.trim();
            alert(`Action for: ${title || 'Item'}\n\n${content || ''}`);
        });
    });
    document.querySelectorAll('.alert-actions .btn-secondary, .stat-actions .btn-secondary, .card-actions .btn-secondary').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.alert-card, .stat-card, .card');
            if (!card) return;
            card.classList.add('read');
            btn.textContent = 'Read';
            btn.disabled = true;
        });
    });
});
