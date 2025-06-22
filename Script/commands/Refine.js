const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "refine",
  version: "3.2.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "ছবিতে AI ইফেক্ট দিয়ে রিফাইন, bg/cartoon/hd/sketch/blu/enhance/remix/all",
  commandCategory: "image edit",
  usages: "/refine [bg/cartoon/hd/blur/sketch/enhance/remix/all]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const type = args[0]?.toLowerCase() || "enhance";
  const supported = ["bg", "cartoon", "hd", "blur", "sketch", "enhance", "remix", "all"];

  if (!supported.includes(type)) {
    return api.sendMessage("❌ refine অপশন দিন:\nbg, cartoon, hd, blur, sketch, enhance, remix, all", event.threadID, event.messageID);
  }

  let imageUrl;
  if (event.type === "message_reply" && event.messageReply.attachments?.[0]?.url) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments?.[0]?.url) {
    imageUrl = event.attachments[0].url;
  }

  if (!imageUrl) {
    return api.sendMessage("❌ ছবিতে reply দিন অথবা ছবি পাঠিয়ে refine দিন!", event.threadID, event.messageID);
  }

  const allEdits = {
    bg: { name: "Background Remove", url: `https://api-zylern.onrender.com/removebg?url=${encodeURIComponent(imageUrl)}` },
    cartoon: { name: "Cartoon", url: `https://api-zylern.onrender.com/cartoon?url=${encodeURIComponent(imageUrl)}` },
    hd: { name: "HD", url: `https://api-zylern.onrender.com/upscale?url=${encodeURIComponent(imageUrl)}` },
    blur: { name: "Blur", url: `https://api-zylern.onrender.com/blur?url=${encodeURIComponent(imageUrl)}` },
    sketch: { name: "Sketch", url: `https://api-zylern.onrender.com/sketch?url=${encodeURIComponent(imageUrl)}` },
    enhance: { name: "Enhance", url: `https://api-zylern.onrender.com/enhance?url=${encodeURIComponent(imageUrl)}` },
    remix: { name: "Remix", url: `https://api-zylern.onrender.com/remix?url=${encodeURIComponent(imageUrl)}` },
  };

  const doEdit = async (key) => {
    const edit = allEdits[key];
    const path = `${__dirname}/cache/${key}_${event.senderID}.png`;

    try {
      console.log(`[✅ REFINE] Trying: ${key.toUpperCase()} - ${edit.url}`);
      const res = await axios.get(edit.url, { responseType: "arraybuffer", timeout: 15000 });

      fs.writeFileSync(path, Buffer.from(res.data, "binary"));
      console.log(`[✅ REFINE] Success: ${key.toUpperCase()}`);

      await api.sendMessage({
        body: `✅ ${edit.name}`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path));
    } catch (e) {
      console.log(`[❌ REFINE ERROR] ${key.toUpperCase()} Failed!`);
      console.log(`[❌ ERROR MESSAGE]:`, e.message);
      await api.sendMessage(`❌ ${edit.name} করতে সমস্যা হয়েছে!\n🧩 ${e.message}`, event.threadID);
    }
  };

  if (type === "all") {
    api.sendMessage("🛠️ সব ইফেক্ট একে একে শুরু হচ্ছে, অপেক্ষা করুন...", event.threadID);
    for (const key of Object.keys(allEdits)) {
      await doEdit(key);
    }
  } else {
    api.sendMessage(`🖌️ ${allEdits[type].name} করা হচ্ছে...`, event.threadID);
    await doEdit(type);
  }
};
