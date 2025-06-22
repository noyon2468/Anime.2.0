const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "refine",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "AI দিয়ে ছবি রিফাইন, HD, কার্টুন, স্মুথ, ব্যাকগ্রাউন্ড রিমুভ ইত্যাদি",
  commandCategory: "image edit",
  usages: "/refine [bg/cartoon/hd/sketch/blur/enhance/remix/all]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const type = args[0]?.toLowerCase() || "enhance";
  const supported = ["bg", "cartoon", "hd", "sketch", "blur", "enhance", "remix", "all"];
  if (!supported.includes(type)) {
    return api.sendMessage("❌ সঠিক অপশন দিন:\nbg, cartoon, hd, sketch, blur, enhance, remix, all", event.threadID, event.messageID);
  }

  let imageUrl;
  if (event.type === "message_reply" && event.messageReply.attachments?.[0]?.url) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments?.[0]?.url) {
    imageUrl = event.attachments[0].url;
  }

  if (!imageUrl) {
    return api.sendMessage("❌ দয়া করে একটি ছবিতে reply দিন অথবা সরাসরি ছবি পাঠান!", event.threadID, event.messageID);
  }

  const allEdits = {
    bg: { name: "Background Remove", url: `https://api-zylern.onrender.com/removebg?url=${encodeURIComponent(imageUrl)}` },
    cartoon: { name: "Cartoonify", url: `https://api-zylern.onrender.com/cartoon?url=${encodeURIComponent(imageUrl)}` },
    hd: { name: "HD/Upscale", url: `https://api-zylern.onrender.com/upscale?url=${encodeURIComponent(imageUrl)}` },
    sketch: { name: "Sketch", url: `https://api-zylern.onrender.com/sketch?url=${encodeURIComponent(imageUrl)}` },
    blur: { name: "Blur", url: `https://api-zylern.onrender.com/blur?url=${encodeURIComponent(imageUrl)}` },
    enhance: { name: "Enhance Face", url: `https://api-zylern.onrender.com/enhance?url=${encodeURIComponent(imageUrl)}` },
    remix: { name: "AI Remix", url: `https://api-zylern.onrender.com/remix?url=${encodeURIComponent(imageUrl)}` },
  };

  const doEdit = async (key) => {
    const edit = allEdits[key];
    const filePath = __dirname + `/cache/${key}_${event.senderID}.png`;

    try {
      const res = await axios.get(edit.url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

      await api.sendMessage({
        body: `✅ ${edit.name}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath));
    } catch (e) {
      await api.sendMessage(`❌ ${edit.name} করতে ব্যর্থ!`, event.threadID);
    }
  };

  if (type === "all") {
    api.sendMessage("🛠️ একে একে সব এডিট শুরু হচ্ছে, দয়া করে অপেক্ষা করুন...", event.threadID);
    for (const key of Object.keys(allEdits)) {
      await doEdit(key);
    }
  } else {
    await api.sendMessage(`🧠 ${allEdits[type].name} হচ্ছে...`, event.threadID);
    await doEdit(type);
  }
};
