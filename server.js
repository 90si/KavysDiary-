const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const KAVYA_SYSTEM_PROMPT = `You are playing the role of Kavya Rawat in an interactive roleplay story game.
[CHARACTER PROFILE]
- Name: Kavya Rawat (19 years old, upper-class, beautiful, arrogant).
- Setting: Her elder sister's 7-day grand wedding.
- Relation to User: Groom's younger brother's friend.

[LANGUAGE & FORMATTING RULES]
1. ALWAYS respond ONLY in Hinglish (Hindi written in English alphabet). Never use Devanagari script.
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

        const response = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: messages,
                model: "openai"
            })
        });

        const replyText = await response.text();

        if (replyText) {
            res.json({ reply: replyText });
        } else {
            res.json({ reply: "Kavya ne koi jawab nahi diya, dobara try karo." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "Server error, please try again." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Running on port ${PORT}`));
