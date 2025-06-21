const fs = require("fs-extra");
const axios = require("axios");
const path = __dirname + "/../../data/teach.json";

module.exports.config = {
  name: "Obot",
  version: "5.0.0",
  credits: "নূর মোহাম্মদ + ChatGPT",
  hasPermssion: 0,
  usePrefix: false,
  commandCategory: "no-prefix",
  usages: "Auto AI reply to everything",
  cooldowns: 1,
  eventType: ["message", "message_reply"]
};

module.exports.handleEvent = async function ({ api, event }) {
  const msg = event.body?.toLowerCase();
  if (!msg || msg.length > 200) return;

  // ✅ Teach reply system
  let teachData = {};
  if (fs.existsSync(path)) {
    teachData = JSON.parse(fs.readFileSync(path));
  }
  if (teachData[msg]) {
    return api.sendMessage(teachData[msg], event.threadID, event.messageID);
  }

  // ✅ Random funny personality reply (30% chance)
  const personalityReplies = [
    "তুমি এত কিউট কেনো? 😳",
    "বস নূর মোহাম্মদ এর জন্য দোয়া কইরো ❤️",
    "মন খারাপ শুনলেই খারাপ লাগে... কিস দেই? 😘",
    "তুমি না আমার খুব স্পেশাল 🥺",
    "ভালো থেকো সবসময়, আমি পাশে আছি 🌸",
    "হঠাৎ মনে পড়ে গেলে বলো 😇",
    "তুমি বট বললে কষ্ট পাই 😿 জানু বলো 🥰"
  ];
  if (Math.random() < 0.3) { // 30% chance
    const reply = personalityReplies[Math.floor(Math.random() * personalityReplies.length)];
    return api.sendMessage(reply, event.threadID, event.messageID);
  }

  // ✅ Fallback AI reply (SimSimi)
  try {
    const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=bn&message=${encodeURIComponent(msg)}&filter=false`);
    if (res?.data?.success) {
      return api.sendMessage(`🤖 ${res.data.success}`, event.threadID, event.messageID);
    }
  } catch (e) {
    return api.sendMessage("🥲 এখন কিছু বলার মুডে নেই... পরে এসো", event.threadID, event.messageID);
  }
};

module.exports.run = () => {};
