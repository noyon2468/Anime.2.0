const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "genimg",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "AI দিয়ে কল্পনা করা ছবি তৈরি করুন 🌺",
  commandCategory: "AI Tools",
  usages: "genimg <কল্পনার টেক্সট>",
  cooldowns: 2
};

module.exports.run = async ({ api, event, args }) => {
  const prompt = args.join(" ");
  const path = __dirname + "/cache/genimg.png";

  if (!prompt) {
    return api.sendMessage(
      "📸 দয়া করে কল্পনার বিষয় লিখুন!\n\n📌 উদাহরণ:\ngenimg চাঁদের নিচে মেঘে ভাসছে এক জাদুর শহর",
      event.threadID,
      event.messageID
    );
  }

  try {
    const response = await axios.get(
      `https://imagine.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
      { responseType: "arraybuffer" }
    );

    fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

    return api.sendMessage({
      body: `✨ AI ইমেজ তৈরি হয়েছে:\n“${prompt}”`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ ইমেজ তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন!", event.threadID, event.messageID);
  }
};
