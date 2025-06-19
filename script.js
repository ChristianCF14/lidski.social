document.addEventListener('DOMContentLoaded', () => {

    // --- EFEITO DO CURSOR ---
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        // Atualiza a posição da "luz" de fundo
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);

        // Move o ponto principal do cursor
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        // Cria um ponto de rastro
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        document.body.appendChild(trail);

        // Remove o rastro após a animação
        setTimeout(() => {
            trail.remove();
        }, 500);
    });
    

    // --- ANIMAÇÃO DO CANVAS DE FUNDO (BOLINHAS FLUTUANTES) ---
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 100; // Aumentei o número de partículas
    const particleColor = '#9400D3';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7; // Velocidade levemente ajustada
            this.vy = (Math.random() - 0.5) * 0.7;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2; // Opacidade aleatória para profundidade
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Faz as partículas reaparecerem do outro lado (efeito de loop)
            if (this.x < -this.size) this.x = canvas.width + this.size;
            if (this.x > canvas.width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = canvas.height + this.size;
            if (this.y > canvas.height + this.size) this.y = -this.size;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redefine o alpha global antes de desenhar
        ctx.globalAlpha = 1;

        particles.forEach(p => {
            p.update();
            p.draw(); // Desenha cada partícula como uma bolinha
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});