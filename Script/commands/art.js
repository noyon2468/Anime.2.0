const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");

const STYLES = ["anime", "cyberpunk", "vaporwave", "fantasy", "dreamy", "mystic"];

module.exports.config = {
  name: "art",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "CYBER TEAM + নূর মোহাম্মদ ",
  description: "AI দিয়ে ছবি artify করো বিভিন্ন স্টাইলে, next system সহ",
  commandCategory: "image-edit",
  usages: "reply image or type /next",
  cooldowns: 5
};

let lastImageData = {};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply, senderID, body } = event;
  const cachePath = __dirname + "/cache/artify.jpg";

  if (body?.toLowerCase() === "/next") {
    const data = lastImageData[senderID];
    if (!data) return api.sendMessage("❌ তুমি আগে কোনো ছবিতে artify করোনি!", threadID, messageID);

    const nextStyleIndex = (data.styleIndex + 1) % STYLES.length;
    const nextStyle = STYLES[nextStyleIndex];

    try {
      const form = new FormData();
      form.append("image", fs.createReadStream(data.path));

      const result = await axios.post(
        `https://art-api-97wn.onrender.com/artify?style=${nextStyle}`,
        form,
        { headers: form.getHeaders(), responseType: "arraybuffer" }
      );

      fs.writeFileSync(cachePath, result.data);
      lastImageData[senderID].styleIndex = nextStyleIndex;

      return api.sendMessage({
        body: `✅ স্টাইল পরিবর্তন করা হয়েছে: ${nextStyle}`,
        attachment: fs.createReadStream(cachePath)
      }, threadID, messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ style পরিবর্তনে সমস্যা হয়েছে!", threadID, messageID);
    }
  }

  // Initial image process
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("❌ দয়া করে একটি ছবির রিপ্লাই দিন!", threadID, messageID);
  }

  const imgURL = messageReply.attachments[0].url;
  const style = STYLES[0];

  try {
    api.setMessageReaction("🎨", messageID, () => {}, true);

    const imgData = await axios.get(imgURL, { responseType: "arraybuffer" });
    const originalPath = `${__dirname}/cache/original_${senderID}.jpg`;
    fs.writeFileSync(originalPath, Buffer.from(imgData.data, "utf-8"));

    const form = new FormData();
    form.append("image", fs.createReadStream(originalPath));

    const result = await axios.post(
      `https://art-api-97wn.onrender.com/artify?style=${style}`,
      form,
      { headers: form.getHeaders(), responseType: "arraybuffer" }
    );

    fs.writeFileSync(cachePath, result.data);
    api.setMessageReaction("✅", messageID, () => {}, true);

    lastImageData[senderID] = {
      path: originalPath,
      styleIndex: 0
    };

    return api.sendMessage({
      body: `✅ তোমার ছবিকে artify করা হয়েছে: ${style}\n\n🌀 টাইপ করো "/next" অন্য স্টাইলে দেখতে`,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => fs.unlinkSync(cachePath), messageID);

  } catch (err) {
    console.error(err);
    api.setMessageReaction("❌", messageID, () => {}, true);
    return api.sendMessage("❌ কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করো।", threadID, messageID);
  }
};
