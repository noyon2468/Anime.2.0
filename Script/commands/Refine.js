const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "refine",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "AI দিয়ে ছবি রিফাইন, কার্টুন, HD, স্মুথ, রিমুভ ব্যাকগ্রাউন্ড ইত্যাদি",
  commandCategory: "image edit",
  usages: "reply image + refine [bg/cartoon/hd/blur/sketch/enhance/remix/all]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  let type = args[0]?.toLowerCase() || "enhance";
  const supported = ["bg", "cartoon", "hd", "blur", "sketch", "enhance", "remix", "all"];

  if (!supported.includes(type)) {
    return api.sendMessage(
      `❌ অপশনটি সঠিক নয়!\n\n📌 refine কমান্ডের অপশন:\n/refine bg\n/refine cartoon\n/refine hd\n/refine blur\n/refine sketch\n/refine enhance\n/refine remix\n/refine all`,
      event.threadID,
      event.messageID
    );
  }

  let imageUrl = null;

  if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments.length > 0) {
    imageUrl = event.attachments[0].url;
  }

  if (!imageUrl) {
    return api.sendMessage("❌ একটি ছবিতে reply দিন বা সরাসরি ছবি পাঠিয়ে /refine [type] দিন।", event.threadID, event.messageID);
  }

  const apis = {
    bg: "https://api.remove.bg/remove?url=",
    cartoon: "https://api.zxcl.workers.dev/cartoon?url=",
    hd: "https://api.zxcl.workers.dev/upscale?url=",
    blur: "https://api.zxcl.workers.dev/blur?url=",
    sketch: "https://api.zxcl.workers.dev/sketch?url=",
    enhance: "https://api.zxcl.workers.dev/enhance?url=",
    remix: "https://api.zxcl.workers.dev/remix?url="
  };

  const showName = {
    bg: "🎯 Background Removed",
    cartoon: "🎨 Cartoon Version",
    hd: "📸 HD/4K Upscaled",
    blur: "🌫️ Blur Effect",
    sketch: "✏️ Sketch Style",
    enhance: "💆‍♂️ Enhanced Face",
    remix: "🌈 AI Remix Style"
  };

  const doEdit = async (key) => {
    try {
      const res = await axios.get(`${apis[key]}${encodeURIComponent(imageUrl)}`, {
        responseType: "arraybuffer"
      });
      const filePath = `${__dirname}/cache/${key}_${event.senderID}.png`;
      fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));
      await api.sendMessage({
        body: showName[key],
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath));
    } catch (e) {
      await api.sendMessage(`❌ ${key.toUpperCase()} apply করতে সমস্যা হয়েছে!`, event.threadID);
    }
  };

  if (type === "all") {
    api.sendMessage("🛠️ সব এডিট একে একে করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", event.threadID, event.messageID);
    for (const key of Object.keys(apis)) {
      await doEdit(key);
    }
    return;
  }

  api.sendMessage(`✨ ${showName[type]} তৈরি হচ্ছে...`, event.threadID, event.messageID);
  await doEdit(type);
};
