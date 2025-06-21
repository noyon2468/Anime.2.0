const { Configuration, OpenAIApi } = require("openai");
const cooldown = new Map();

module.exports.config = {
  name: "openai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ x ChatGPT",
  description: "Auto AI reply with GPT (no prefix)",
  commandCategory: "no-prefix",
  usages: "auto",
  cooldowns: 0,
};

const configuration = new Configuration({
  apiKey: process.env.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, // 🔐 .env file থেকে key নেবে
});
const openai = new OpenAIApi(configuration);

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  // Skip small or emoji-only messages
  if (body.length < 2 || /^[\u2700-\u27BF\uE000-\uF8FF]+$/.test(body)) return;

  // Cooldown check (5 sec)
  if (cooldown.has(senderID)) return;
  cooldown.set(senderID, true);
  setTimeout(() => cooldown.delete(senderID), 5000);

  const isNur = senderID == "100035389598342"; // 👑 নূর মোহাম্মদ
  const userPrompt = `${isNur ? "Reply like you love and respect Nur Mohammad. Use Banglish, emotion, and be extra friendly." : "Reply smartly in Banglish. Be a chatbot friend. Be fun."}
User: ${body}
AI:`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // চাইলে gpt-4 বানাতে পারো
      messages: [{ role: "user", content: userPrompt }],
    });

    const reply = response.data.choices[0].message.content.trim();
    api.sendMessage(reply, threadID);
  } catch (error) {
    console.error("OpenAI Auto-Reply Error:", error.message);
  }
};

module.exports.run = () => {};
