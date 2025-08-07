// Sidebar Toggle Functionality
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.createElement('div');
    toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.left = 'calc(280px - 18px)';
    toggleBtn.style.top = '20px';
    toggleBtn.style.width = '36px';
    toggleBtn.style.height = '36px';
    toggleBtn.style.backgroundColor = 'white';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    toggleBtn.style.zIndex = '1000';
    toggleBtn.style.transition = 'all 0.3s ease';
    document.body.appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-collapsed');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-chevron-left');
        icon.classList.toggle('fa-chevron-right');
        
        if (sidebar.classList.contains('sidebar-collapsed')) {
            this.style.left = 'calc(80px - 18px)';
        } else {
            this.style.left = 'calc(280px - 18px)';
        }
    });
    
    // Hover to expand sidebar on mobile
    if (window.innerWidth <= 1200) {
        sidebar.classList.add('sidebar-collapsed');
        sidebar.addEventListener('mouseenter', function() {
            this.classList.remove('sidebar-collapsed');
        });
        sidebar.addEventListener('mouseleave', function() {
            this.classList.add('sidebar-collapsed');
        });
    }
}

// Tab Switching
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// Initialize Charts
function initCharts() {
    // Platform sentiment charts
    const platformData = {
        facebook: {
            positive: 58,
            neutral: 30,
            negative: 12,
            color: '#1877f2'
        },
        twitter: {
            positive: 62,
            neutral: 25,
            negative: 13,
            color: '#1da1f2'
        },
        instagram: {
            positive: 72,
            neutral: 20,
            negative: 8,
            color: '#e1306c'
        },
        youtube: {
            positive: 55,
            neutral: 35,
            negative: 10,
            color: '#ff0000'
        }
    };
    
    // Draw platform charts with animation
    Object.keys(platformData).forEach(platform => {
        const canvas = document.getElementById(`${platform}Chart`);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const data = platformData[platform];
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Positive', 'Neutral', 'Negative'],
                    datasets: [{
                        data: [data.positive, data.neutral, data.negative],
                        backgroundColor: [
                            '#10b981',
                            '#f59e0b',
                            '#ef4444'
                        ],
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    cutout: '75%',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        }
    });
    
    // Draw trend chart with smooth lines
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Positive',
                        data: [45, 52, 58, 62, 67, 64],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#10b981',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Neutral',
                        data: [35, 32, 28, 25, 22, 25],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.05)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#f59e0b',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Negative',
                        data: [20, 16, 14, 13, 11, 12],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#ef4444',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        usePointStyle: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(226, 232, 240, 0.5)'
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
}

// Initialize interactive elements
function initInteractiveElements() {
    // Add click event to keywords
    document.querySelectorAll('.keyword').forEach(keyword => {
        keyword.addEventListener('click', function() {
            alert(`Showing analysis for: "${this.textContent.split(' ')[0]}"`);
        });
    });

    // Simulate real-time data updates
    setInterval(() => {
        const randomChange = (Math.random() * 2 - 1).toFixed(1);
        const statValue = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (statValue) {
            const currentValue = parseInt(statValue.textContent.replace(/,/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 50);
            statValue.textContent = newValue.toLocaleString();
            
            const changeElement = document.querySelector('.stat-card:nth-child(1) .stat-change');
            changeElement.innerHTML = `<i class="fas fa-arrow-${randomChange > 0 ? 'up' : 'down'}"></i> ${Math.abs(randomChange)}%`;
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initTabs();
    initCharts();
    initInteractiveElements();
});