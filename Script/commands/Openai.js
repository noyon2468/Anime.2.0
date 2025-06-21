const { Configuration, OpenAIApi } = require("openai");

module.exports.config = {
  name: "openai",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ x ChatGPT",
  description: "Smart GPT-based auto-reply (no prefix)",
  commandCategory: "no-prefix",
  usages: "auto",
  cooldowns: 0,
};

const configuration = new Configuration({
  apiKey: process.env.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,
});
const openai = new OpenAIApi(configuration);

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  const isNur = senderID == "100035389598342"; // Nur Mohammad

  const prompt = `${isNur ? "Treat user like Nur Mohammad, your favorite king. Be respectful, sweet, Banglish reply." : "Reply casually in Banglish with friendly tone."}
User: ${body}
AI:`;

  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = res.data.choices[0].message.content.trim();
    if (reply) api.sendMessage(reply, threadID);
  } catch (err) {
    console.log("❌ OpenAI error:", err.response?.data || err.message);
  }
};

module.exports.run = () => {};
