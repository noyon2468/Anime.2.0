const fs = require("fs");

module.exports.config = {
  name: "women",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
  description: "Responds to the word 'women' with a video",
  commandCategory: "no prefix",
  usages: "women",
  cooldowns: 5
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, body } = event;
  const trigger = body?.toLowerCase();

  if (!trigger) return;

  if (trigger.startsWith("women") || trigger.startsWith("☕")) {
    const path = __dirname + `/noprefix/wn.mp4`;
    
    if (!fs.existsSync(path)) {
      return api.sendMessage("⚠️ Video not found: wn.mp4", threadID, messageID);
    }

    api.sendMessage({
      body: "😂 হাহাহা Women!",
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      api.setMessageReaction("☕", messageID, () => {}, true);
    });
  }
};

module.exports.run = () => {}; // not needed but required for command file
