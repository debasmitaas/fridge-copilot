import { initDotPattern } from './dot-pattern.js';
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${BACKEND_BASE}/api/analyze`;

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const uploadText = document.getElementById('uploadText');
const analyzeBtn = document.getElementById('analyzeBtn');
const loader = document.getElementById('loader');
const resultContainer = document.getElementById('resultContainer');


document.addEventListener('DOMContentLoaded', () => {
    // 1. Run GSAP animations
    // initPageAnimations();
    
    // // 2. Setup button hover
    // const dropZone = document.getElementById('dropZone');
    // setupHoverAnimation(dropZone);

    // 3. Start the magical background! <-- NEW
    initDotPattern(); 
});

imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        
        // UI Fix: Hide text and show image
        preview.classList.remove('hidden');
        uploadText.classList.add('hidden');
        
        analyzeBtn.disabled = false;
    }
};

analyzeBtn.onclick = async () => {
    const file = imageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    // Toggle Loading State
    analyzeBtn.classList.add('hidden');
    loader.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    try {
        const res = await fetch(API_URL, { 
            method: 'POST', 
            body: formData 
        });

        if (!res.ok) throw new Error('Backend error');

        const data = await res.json();
        
        // Parse and Display Markdown
        resultContainer.innerHTML = marked.parse(data.recipe);
        resultContainer.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        alert("Chef is offline. Please check if yourbackend is running and try again!");
    } finally {
        loader.classList.add('hidden');
        analyzeBtn.classList.remove('hidden');
    }
};