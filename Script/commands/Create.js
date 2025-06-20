const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "create",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Nur Muhammad + ChatGPT",
  description: "🔮 AI দিয়ে ছবি তৈরি করুন শুধু কল্পনা দিয়ে!",
  commandCategory: "ai-photo",
  usages: "create <আপনার কল্পনার বর্ণনা>",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  const query = args.join(" ");
  const { threadID, messageID } = event;

  if (!query) {
    return api.sendMessage(
      "✍️ একটি টেক্সট দিন ছবি তৈরির জন্য!\n\n📌 উদাহরণ:\ncreate sunset on mars\ncreate মসজিদে বসে কোরআন পড়ছে",
      threadID,
      messageID
    );
  }

  const waitMsg = await api.sendMessage("🖼️ আপনার ছবি তৈরি হচ্ছে...\n⏳ দয়া করে একটু অপেক্ষা করুন!", threadID);

  try {
    const imgData = (await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
      responseType: "arraybuffer",
    })).data;

    const filePath = `${__dirname}/cache/ai_create.png`;
    fs.writeFileSync(filePath, Buffer.from(imgData, "utf-8"));

    api.sendMessage({
      body: `✅ আপনার AI ইমেজ তৈরি হয়েছে!\n🔎 Prompt: ${query}`,
      attachment: fs.createReadStream(filePath),
    }, threadID, () => {
      fs.unlinkSync(filePath);
      api.unsendMessage(waitMsg.messageID);
    }, messageID);
    
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ ছবি তৈরি করতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন!", threadID, messageID);
  }
};
