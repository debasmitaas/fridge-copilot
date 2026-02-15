// js/animations.js

/**
 * Senior Dev Refactor: Pure Fade-In Logic
 * - Removed all 'x' and 'y' movement for a stationary bloom effect.
 * - Used a slightly longer duration for a "magical" feel.
 */

export const initPageAnimations = () => {
    const githubBtn = document.querySelector(".github-link");
    const wrapper = document.querySelector(".app-wrapper");
    const bgContainer = document.querySelector("#dot-pattern-container");

    const tl = gsap.timeline({ 
        defaults: { 
            ease: "power2.inOut", 
            duration: 1.2 
        } 
    });

    // 1. Slowly reveal the background dots
    if (bgContainer) {
        tl.from(bgContainer, {
            opacity: 0,
            duration: 2 // Longer duration for a smoother start
        });
    }

    // 2. Fade in the GitHub button right where it is
    if (githubBtn) {
        tl.from(githubBtn, {
            opacity: 0,
            scale: 0.95, // Very subtle scale-up so it doesn't just "pop"
            duration: 1,
            clearProps: "all" 
        }, "-=1.5"); // Starts while background is still fading in
    }

    // 3. Fade in the main content (Text and Card)
    if (wrapper) {
        tl.from(wrapper, {
            opacity: 0,
            duration: 1.5
        }, "-=1"); // Overlaps for a fluid, synchronized feel
    }
};

/**
 * Recipe Reveal: Stationary Fade
 */
export const animateRecipeReveal = (container) => {
    if (!container) return;

    container.classList.remove('hidden');

    gsap.from(container, { 
        opacity: 0, 
        duration: 1.2, 
        ease: "power2.out",
        onComplete: () => {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
};