const axios = require("axios");
const fs = require("fs-extra");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
  config: {
    name: "autodl",
    version: "0.0.3",
    hasPermssion: 0,
    credits: "SHAON ",
    description: "Auto download video from links (like TikTok, etc)",
    commandCategory: "media",
    usages: "Send any video link in inbox or group",
    cooldowns: 3
  },

  run: async function({ api, event, args }) {
    // This command works automatically via handleEvent
    return;
  },

  handleEvent: async function({ api, event }) {
    const content = event.body ? event.body.trim() : '';
    if (!content || !content.startsWith("https://")) return;

    try {
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);

      const data = await alldown(content);
      if (!data || !data.url) return api.sendMessage("❌ ভিডিও লিংক থেকে ডাউনলোড করতে পারিনি!", event.threadID, event.messageID);

      const videoUrl = data.url;
      const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;

      const filePath = __dirname + "/cache/auto.mp4";
      fs.writeFileSync(filePath, Buffer.from(videoBuffer, "utf-8"));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return api.sendMessage({
        body: `🔥🚀  𝗖𝗵𝗮𝘁 𝗕𝗼𝘁 | 🔥💻\n📥⚡𝗔𝘂𝘁𝗼 𝗩𝗶𝗱𝗲𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\n🎬 Enjoy your video!\n\n📎 Owner: নূর মোহাম্মদ`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath));
      
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ একটি সমস্যা হয়েছে ভিডিও ডাউনলোডে। আবার চেষ্টা করুন!", event.threadID, event.messageID);
    }
  }
};
