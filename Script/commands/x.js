const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "say",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "বাংলা টেক্সট দিয়ে ভয়েস (Google TTS)",
  commandCategory: "media",
  usages: "[বাংলা টেক্সট]",
  cooldowns: 5,
  dependencies: {
    "path": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const text = args.join(" ") || (event.messageReply ? event.messageReply.body : null);
  const language = "bn";

  if (!text) {
    return api.sendMessage("⚠️ দয়া করে বাংলা টেক্সট দিন!", event.threadID);
  }

  try {
    const filePath = path.resolve(__dirname, "cache", `${event.senderID}_${event.threadID}.mp3`);
    const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;

    await global.utils.downloadFile(googleTTSUrl, filePath);

    return api.sendMessage(
      {
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );
  } catch (err) {
    console.log(err);
    return api.sendMessage("❌ অডিও ফাইল পাঠাতে সমস্যা হয়েছে।", event.threadID);
  }
};
