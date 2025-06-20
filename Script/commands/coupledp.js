const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "coupledp",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Loid Butter + Modified by Nur Muhammad & ChatGPT",
  description: "Get a cute anime couple dp",
  commandCategory: "image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  await sendCoupleDP(api, event);
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.body.toLowerCase() == "/next" && event.senderID == handleReply.author) {
    await sendCoupleDP(api, event);
  }
};

async function sendCoupleDP(api, event) {
  const malePath = path.join(__dirname, "/cache/male.png");
  const femalePath = path.join(__dirname, "/cache/female.png");

  try {
    const { data } = await axios.get("https://tanjiro-api.onrender.com/cdp?api_key=tanjiro");

    const maleImg = await axios.get(data.male, { responseType: "arraybuffer" });
    fs.writeFileSync(malePath, Buffer.from(maleImg.data, "utf-8"));

    const femaleImg = await axios.get(data.female, { responseType: "arraybuffer" });
    fs.writeFileSync(femalePath, Buffer.from(femaleImg.data, "utf-8"));

    const msg = "💖 𝗖𝗼𝘂𝗽𝗹𝗲 𝗗𝗣 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 💑\n\nReply with /next to get another one 🔁";
    const attachments = [
      fs.createReadStream(malePath),
      fs.createReadStream(femalePath)
    ];

    api.sendMessage({
      body: msg,
      attachment: attachments
    }, event.threadID, (err, info) => {
      fs.unlinkSync(malePath);
      fs.unlinkSync(femalePath);
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "next"
      });
    }, event.messageID);

  } catch (err) {
    console.error("❌ Error fetching couple DP:", err.message);
    api.sendMessage("⚠️ দুঃখিত, এখনই ছবি আনা সম্ভব হচ্ছে না। একটু পরে চেষ্টা করুন।", event.threadID, event.messageID);
  }
                    }
