// 1. Init AOS Animations
AOS.init({ duration: 800, once: true });

// 2. Spotlight Effect Logic
const grid = document.getElementById('spotlight-grid');
const cards = document.querySelectorAll('.card');

if (grid) {
    grid.onmousemove = e => {
        for(const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };
}

// 3. Navbar Scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// 4. Copy IP
function copyIp() {
    navigator.clipboard.writeText("f3f5.net");
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
}

// 5. Particles Animation 
const canvas = document.getElementById('particles-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width, height;
    let particles = [];
    let mouse = { x: 0, y: 0, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * dpr;
        mouse.y = (e.clientY - rect.top) * dpr;
    });

    function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.scale(dpr, dpr);
        width = w;
        height = h;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius && distance > 0) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= (dx/distance) * force * 2;
                this.y -= (dy/distance) * force * 2;
            }
        }
        draw() {
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = (width * height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            let dx = mouse.x - particles[i].x;
            let dy = mouse.y - particles[i].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < 150) {
                ctx.strokeStyle = `rgba(220, 38, 38, ${1 - distance/150})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}
