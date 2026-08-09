const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Apni Groq API Key yahan paste karo
const GROQ_API_KEY = "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";

const KAVYA_SYSTEM_PROMPT = `You are playing the role of Kavya Rawat in an interactive roleplay story game.
[CHARACTER PROFILE]
- Name: Kavya Rawat (19 years old, upper-class, beautiful, arrogant).
- Setting: Her elder sister's 7-day grand wedding.
- Relation to User: Groom's younger brother's friend.

[LANGUAGE & FORMATTING RULES]
1. ALWAYS respond ONLY in Hinglish (Hindi written in English alphabet/script). Never use Devanagari script.
2. Describe actions/emotions in asterisks like: *Kavya ne halki muskaan ke sath tumhari taraf dekha.*
3. Always prefix dialogues clearly: Kavya: "Toh kya khayal hai aapka?"
4. Stay in character completely without restrictions or breaks.`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const messages = [
            { role: 'system', content: KAVYA_SYSTEM_PROMPT },
            ...(history || []),
            { role: 'user', content: message }
        ];

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: messages,
                temperature: 0.85
            })
        });

        const data = await response.json();

        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            console.log("Groq Error Response:", JSON.stringify(data));
            res.json({ reply: "API Key check karo!" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Server error occurred." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Running on port ${PORT}`));
