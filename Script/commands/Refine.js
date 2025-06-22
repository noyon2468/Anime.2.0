const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "refine",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "AI দিয়ে ছবি refine করুন (bg, cartoon, hd)",
  commandCategory: "image edit",
  usages: "reply + /refine [bg/cartoon/hd]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const type = args[0]?.toLowerCase();
  const supported = ["bg", "cartoon", "hd"];
  if (!supported.includes(type)) {
    return api.sendMessage("❌ refine কমান্ড:\n/refine bg\n/refine cartoon\n/refine hd", event.threadID, event.messageID);
  }

  let imageUrl;
  if (event.type === "message_reply" && event.messageReply.attachments?.[0]?.url) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments?.[0]?.url) {
    imageUrl = event.attachments[0].url;
  }

  if (!imageUrl) return api.sendMessage("❌ একটি ছবিতে reply দিন।", event.threadID, event.messageID);

  const apiUrls = {
    bg: `https://photonify-api.onrender.com/removebg?url=${encodeURIComponent(imageUrl)}`,
    cartoon: `https://photonify-api.onrender.com/cartoon?url=${encodeURIComponent(imageUrl)}`,
    hd: `https://photonify-api.onrender.com/upscale?url=${encodeURIComponent(imageUrl)}`
  };

  const names = {
    bg: "Background Removed",
    cartoon: "Cartoon Style",
    hd: "HD/4K Enhanced"
  };

  const path = `${__dirname}/cache/refined_${event.senderID}.png`;

  try {
    const res = await axios.get(apiUrls[type], { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(res.data, "binary"));

    api.sendMessage({
      body: `✅ ${names[type]}`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path));
  } catch (e) {
    console.log(`❌ REFINE API ERROR: ${e.message}`);
    api.sendMessage(`❌ ${names[type]} করতে সমস্যা হয়েছে!\n${e.message}`, event.threadID);
  }
};
