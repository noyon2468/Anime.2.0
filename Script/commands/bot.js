const axios = require("axios");

module.exports.config = {
  name: "Obot",
  version: "2.0.0",
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "AI auto-reply like ChatGPT",
  eventType: ["message", "message_reply"],
  hasPermssion: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const message = event.body;
  if (!message || message.length > 200) return;

  const prompt = `User: ${message}\nAI (friendly, emotional, smart, Bangla-English mix, short reply):`;

  try {
    const gptReply = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = gptReply.data.choices[0].message.content;
    if (reply)
      return api.sendMessage(reply.trim(), event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ Obot API Error:", err.message);
    return api.sendMessage("🥲 দুঃখিত, এখন আমি উত্তর দিতে পারছি না...", event.threadID, event.messageID);
  }
};

module.exports.run = () => {};
