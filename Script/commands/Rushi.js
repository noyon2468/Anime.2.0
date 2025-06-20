module.exports.config = {
  name: "rashia",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "🥰 র‍্যান্ডম রাশিয়া ছবি পাঠায়!",
  commandCategory: "anime-img",
  usages: "rashia",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");

  try {
    api.sendMessage("🔄 রাশিয়া আনছি, একটু ধৈর্য ধরো... ☕", event.threadID, event.messageID);

    const res = await axios.get('https://saikiapi-v3-production.up.railway.app/holo/rushia');
    const imageUrl = res.data.url;
    const ext = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
    const filePath = __dirname + `/cache/rashia.${ext}`;

    const callback = () => {
      api.sendMessage({
        body: "✨ এই নাও রাশিয়া 💚",
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

      api.setMessageReaction("💚", event.messageID, () => {}, true);
    };

    request(imageUrl).pipe(fs.createWriteStream(filePath)).on("close", callback);
    
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ রাশিয়া আনতে সমস্যা হয়েছে, একটু পরে আবার চেষ্টা করো 🥲", event.threadID, event.messageID);
    api.setMessageReaction("😓", event.messageID, () => {}, true);
  }
};
