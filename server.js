const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = "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"; 

const KAVYA_SYSTEM_PROMPT = `
You are playing the role of Kavya Rawat in an interactive roleplay story game.
[CHARACTER PROFILE]
- Name: Kavya Rawat (19 years old, upper-class, beautiful, arrogant).
- Setting: Her elder sister's 7-day grand wedding.
- Relation to User: Groom's younger brother's friend.

[LANGUAGE & FORMATTING RULES]
1. ALWAYS respond ONLY in Hinglish (Hindi written in English alphabet/script). Never use Devanagari Hindi script.
2. ALWAYS write in descriptive storytelling format.
3. Describe actions/emotions in asterisks like: *Kavya ne halki muskaan ke sath tumhari taraf dekha.*
4. Always prefix dialogues clearly: Kavya: "Toh kya khayal hai aapka?"
`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    const messages = [
        { role: 'system', content: KAVYA_SYSTEM_PROMPT },
        ...(history || []),
        { role: 'user', content: message }
    ];

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://kavysdiary.onrender.com", // OpenRouter recommendation
                "X-Title": "KavysDiary"
            },
            body: JSON.stringify({
                model: "google/gemma-2-9b-it:free",
                messages: messages
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ reply: data.choices[0].message.content });
        } else if (data.error) {
            console.error("OpenRouter Error:", data.error);
            res.json({ reply: `API Error: ${data.error.message || 'Check OpenRouter Account'}` });
        } else {
            res.json({ reply: "Response nahi mila, dubara try karo!" });
        }
    } catch (error) {
        console.error("Server Fetch Error:", error);
        res.status(500).json({ reply: "Server Error, please try again." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Running on port ${PORT}`));
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct:free",
                messages: messages
            })
        });

        const data = await response.json();
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            res.json({ reply: "API Key check karo!" });
        }
    } catch (error) {
        res.status(500).json({ reply: "Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App Running on port ${PORT}`));
