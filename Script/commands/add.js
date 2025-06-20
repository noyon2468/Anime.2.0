const axios = require('axios');

module.exports.config = {
  name: "add",
  version: "1.0.1",
  hasPermission: 0,
  credits: "নূর মোহাম্মদ + Shaon + ChatGPT",
  description: "Reply করা ভিডিও/ছবির URL নির্দিষ্ট নামে সংরক্ষণ করে",
  commandCategory: "media",
  usages: "add [name] (reply video/image)",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const { messageReply, threadID, messageID } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("📌 দয়া করে কোনো ভিডিও বা ছবিতে রিপ্লাই করে কমান্ডটি দিন!", threadID, messageID);
    }

    const fileUrl = messageReply.attachments[0].url;
    const name = args.join(" ").trim();

    if (!name) return api.sendMessage("📌 ভিডিওর একটি নাম দিন!\nউদাহরণ: add আমার_প্রিয়_ভিডিও", threadID, messageID);

    const apiConfig = (await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json')).data;
    const imgurApi = apiConfig.imgur;
    const mainApi = apiConfig.api;

    // Upload to imgur
    const imgurRes = await axios.get(`${imgurApi}/imgur?link=${encodeURIComponent(fileUrl)}`);
    const uploadedUrl = imgurRes.data.uploaded.image;

    // Save to database via API
    const saveRes = await axios.get(`${mainApi}/video/random?name=${encodeURIComponent(name)}&url=${encodeURIComponent(uploadedUrl)}`);
    
    return api.sendMessage(
      `✅ ভিডিও যুক্ত হয়েছে সফলভাবে!\n\n🔹 নাম: ${saveRes.data.name}\n🔗 লিংক: ${saveRes.data.url}`,
      threadID, messageID
    );
    
  } catch (e) {
    console.error(e);
    return api.sendMessage(`❌ ত্রুটি: ${e.message}`, event.threadID, event.messageID);
  }
};
