const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.1.0",
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Ask anything with AI (OpenAI GPT)",
  usePrefix: true,
  commandCategory: "ai",
  cooldowns: 2
};

const OPENAI_API_KEY = "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";

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("📝 প্রশ্ন লেখো যেমন: /ai বঙ্গবন্ধু কে?", event.threadID, event.messageID);

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const reply = res.data.choices[0].message.content.trim();
    return api.sendMessage(`🤖 ${reply}`, event.threadID, event.messageID);
  } catch (err) {
    console.log("GPT ERROR:", err.message);
    return api.sendMessage("😔 দুঃখিত, AI উত্তর দিতে পারছে না এই মুহূর্তে। পরে চেষ্টা করো।", event.threadID, event.messageID);
  }
};
