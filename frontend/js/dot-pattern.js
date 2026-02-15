// js/dot-pattern.js

/**
 * Senior Developer Refactor: 
 * - Switched to window listeners for better event capture.
 * - Added a 'glow' boost for Light Mode visibility.
 * - Optimized coordinate calculation.
 */

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
}

export function initDotPattern(options = {}) {
    const config = {
        dotSize: 1.5,
        gap: 22,
        baseColor: "#d1d5db", // Slightly darker gray for better base contrast
        glowColor: "#2563eb", 
        proximity: 150,       // Larger radius for easier detection
        glowIntensity: 1.5,   // Higher intensity for light backgrounds
        waveSpeed: 0.4,
        ...options
    };

    const container = document.getElementById('dot-pattern-container');
    const canvas = document.getElementById('dot-canvas');
    if (!container || !canvas) {
        console.error("DotPattern: Container or Canvas not found.");
        return;
    }

    const ctx = canvas.getContext("2d");
    let dots = [];
    let mouse = { x: -1000, y: -1000 };
    let animationFrameId;
    const startTime = Date.now();

    const baseRgb = hexToRgb(config.baseColor);
    const glowRgb = hexToRgb(config.glowColor);

    function buildGrid() {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        ctx.scale(dpr, dpr);

        const cellSize = config.dotSize + config.gap;
        const cols = Math.ceil(rect.width / cellSize) + 1;
        const rows = Math.ceil(rect.height / cellSize) + 1;

        const offsetX = (rect.width - (cols - 1) * cellSize) / 2;
        const offsetY = (rect.height - (rows - 1) * cellSize) / 2;

        dots = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                dots.push({
                    x: offsetX + col * cellSize,
                    y: offsetY + row * cellSize,
                    baseOpacity: 0.2 + Math.random() * 0.15,
                });
            }
        }
    }

    function draw() {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        const proxSq = config.proximity * config.proximity;
        const time = (Date.now() - startTime) * 0.001 * config.waveSpeed;

        for (const dot of dots) {
            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            // Wave animation logic
            const wave = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5;
            const waveOpacity = dot.baseOpacity + wave * 0.1;
            const waveScale = 1 + wave * 0.15;

            let opacity = waveOpacity;
            let scale = waveScale;
            let r = baseRgb.r;
            let g = baseRgb.g;
            let b = baseRgb.b;
            let glow = 0;

            // Interaction logic
            if (distSq < proxSq) {
                const dist = Math.sqrt(distSq);
                const t = 1 - dist / config.proximity;
                const easedT = t * t * (3 - 2 * t); 

                r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * easedT);
                g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * easedT);
                b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * easedT);

                opacity = Math.min(1, waveOpacity + easedT * 0.8);
                scale = waveScale + easedT * 1.2;
                glow = easedT * config.glowIntensity;
            }

            const radius = (config.dotSize / 2) * scale;

            // Render Glow Layer
            if (glow > 0) {
                const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 6);
                gradient.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.35})`);
                gradient.addColorStop(0.6, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`);
                
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius * 6, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Render Dot Layer
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    // SENIOR DEV FIX: Using window to capture coordinates regardless of layers
    window.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
        mouse = { x: -1000, y: -1000 };
    });

    const ro = new ResizeObserver(() => buildGrid());
    ro.observe(container);

    buildGrid();
    draw();
}