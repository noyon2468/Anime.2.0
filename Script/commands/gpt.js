const axios = require("axios");

module.exports.config = {
  name: "gpt",
  version: "2.1",
  hasPermission: 0,
  credits: "Nur Muhammad + ChatGPT",
  usePrefix: false,
  description: "Gemini AI দিয়ে বাংলা/English প্রশ্নের উত্তর নিন",
  commandCategory: "ai-chat",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("✍️ প্রশ্ন দিন!\n\n📌 উদাহরণ:\ngpt রাসুল (সঃ) এর জীবনী", event.threadID, event.messageID);

  const waiting = await api.sendMessage("🤖 𝙂𝙚𝙢𝙞𝙣𝙞 চিন্তা করছে...\n⏳ অনুগ্রহ করে অপেক্ষা করুন...", event.threadID, event.messageID);

  try {
    const res = await axios.get(`https://sensui-useless-apis.codersensui.repl.co/api/tools/ai?question=${encodeURIComponent(prompt)}`);
    
    if (!res.data || !res.data.answer) {
      return api.sendMessage("❌ উত্তর পাওয়া যায়নি! একটু পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }

    const answer = res.data.answer;
    const finalReply = `╭──「 🤖 𝗚𝗘𝗠𝗜𝗡𝗜 𝗔𝗜 」\n│\n├ 🧠 প্রশ্ন: ${prompt}\n│\n╰ ✅ উত্তর:\n${answer}`;

    api.sendMessage(finalReply, event.threadID, () => {
      api.unsendMessage(waiting.messageID);
    }, event.messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ Gemini সার্ভারে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
