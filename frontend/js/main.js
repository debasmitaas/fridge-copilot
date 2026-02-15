const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${BACKEND_BASE}/api/analyze`;

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const loader = document.getElementById('loader');
const resultContainer = document.getElementById('resultContainer');

imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.classList.remove('hidden');
        analyzeBtn.disabled = false;
    }
};

analyzeBtn.onclick = async () => {
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    analyzeBtn.classList.add('hidden');
    loader.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    try {
        const res = await fetch(API_URL, { method: 'POST', body: formData });
        const data = await res.json();
        
        resultContainer.innerHTML = marked.parse(data.recipe);
        resultContainer.classList.remove('hidden');
    } catch (err) {
        alert("Server error. Make sure your backend is running.");
    } finally {
        loader.classList.add('hidden');
        analyzeBtn.classList.remove('hidden');
    }
};