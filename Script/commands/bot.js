const axios = require("axios");
const fs = require("fs-extra");
const path = __dirname + "/../../data/teach.json";

const OPENAI_API_KEY = "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";"; // এখানে তোমার Key বসাও

module.exports.config = {
  name: "Obot",
  version: "6.0.0",
  credits: "নূর মোহাম্মদ + ChatGPT",
  hasPermssion: 0,
  usePrefix: false,
  commandCategory: "no-prefix",
  cooldowns: 1,
  eventType: ["message", "message_reply"]
};

module.exports.handleEvent = async function ({ api, event }) {
  const msg = event.body?.toLowerCase();
  if (!msg || msg.length > 300) return;

  // ✅ Teach
  let teachData = {};
  if (fs.existsSync(path)) {
    teachData = JSON.parse(fs.readFileSync(path));
  }
  if (teachData[msg]) {
    return api.sendMessage(teachData[msg], event.threadID, event.messageID);
  }

  // ✅ Funny reply chance (30%)
  const funLines = [
    "তুমি এত কিউট কেনো? 🥺",
    "নূর মোহাম্মদ বসকে সালাম দাও 😎",
    "মন খারাপ করো না... আমি তো আছি! 💖",
    "তুমি না অনেক বেশি স্পেশাল আমার জন্য 😚"
  ];
  if (Math.random() < 0.3) {
    const reply = funLines[Math.floor(Math.random() * funLines.length)];
    return api.sendMessage(reply, event.threadID, event.messageID);
  }

  // ✅ GPT-4 Fallback
  try {
    const gptRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }],
        temperature: 0.8
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    const reply = gptRes.data.choices[0].message.content.trim();
    return api.sendMessage(`🤖 ${reply}`, event.threadID, event.messageID);
  } catch (err) {
    console.log("GPT API Error:", err.message);
    return api.sendMessage("🥲 এখন কথা বলতে পারছি না... পরে এসো", event.threadID, event.messageID);
  }
};

module.exports.run = () => {};
