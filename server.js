const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = "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";

const KAVYA_SYSTEM_PROMPT = `You are playing the role of Kavya Rawat in an interactive roleplay story game.
[CHARACTER PROFILE]
- Name: Kavya Rawat (19 years old, upper-class, beautiful, arrogant).
- Setting: Her elder sister's 7-day grand wedding.
- Relation to User: Groom's younger brother's friend.

[LANGUAGE & FORMATTING RULES]
1. ALWAYS respond ONLY in Hinglish (Hindi written in English alphabet/script).
2. Describe actions/emotions in asterisks like: *Kavya ne halki muskaan ke sath tumhari taraf dekha.*
3. Always prefix dialogues clearly: Kavya: "Toh kya khayal hai aapka?"`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const messages = [
            { role: 'system', content: KAVYA_SYSTEM_PROMPT },
            ...(history || []),
            { role: 'user', content: message }
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemma-2-9b-it:free",
                messages: messages
            })
        });

        const data = await response.json();

        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            console.log("OpenRouter Response:", JSON.stringify(data));
            res.json({ reply: "API Error occurred. Check OpenRouter API key/status." });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Server error occurred." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Running on port ${PORT}`));
