const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No image uploaded.');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Act as a professional chef. Analyze this fridge image and suggest 3 creative recipes based on visible ingredients. Format with Markdown.";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: req.file.buffer.toString('base64'), mimeType: req.file.mimetype } }
        ]);

        res.json({ recipe: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));