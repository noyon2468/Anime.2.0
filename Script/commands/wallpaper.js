const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "wallpaper",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Nur Muhammad + ChatGPT",
  description: "প্রিয় ওয়ালপেপার খুঁজুন",
  usages: "wallpaper [নাম]",
  commandCategory: "utility",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  if (!args[0]) {
    return api.sendMessage("🔍 অনুগ্রহ করে একটি ওয়ালপেপারের নাম লিখুন!\n\nউদাহরণ: `wallpaper sunset` 🌇", event.threadID, event.messageID);
  }

  const query = encodeURIComponent(args.join(" "));
  const apiKey = "39178311-acadeb32d7e369897e41dba06";
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=30`;

  try {
    const response = await axios.get(apiUrl);
    const hits = response.data.hits;

    if (!hits || hits.length === 0) {
      return api.sendMessage(`😔 "${args.join(" ")}" এর জন্য কোনো ওয়ালপেপার পাওয়া যায়নি।`, event.threadID, event.messageID);
    }

    // সর্বোচ্চ 5 টি ছবি পাঠাবে
    const selected = hits.sort(() => 0.5 - Math.random()).slice(0, 5);
    const attachments = [];

    for (let i = 0; i < selected.length; i++) {
      const url = selected[i].largeImageURL;
      const imgPath = path.join(__dirname, `cache/wall${i}.jpg`);

      const imgData = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imgPath, Buffer.from(imgData.data, "binary"));
      attachments.push(fs.createReadStream(imgPath));
    }

    // Send and delete after
    api.sendMessage({
      body: `📸 এখানে আপনার ওয়ালপেপার:\n👉 ${args.join(" ")}`,
      attachment: attachments
    }, event.threadID, () => {
      // Delete after send
      for (let i = 0; i < selected.length; i++) {
        const imgPath = path.join(__dirname, `cache/wall${i}.jpg`);
        fs.unlinkSync(imgPath);
      }
    }, event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ ওয়ালপেপার আনতে সমস্যা হচ্ছে। দয়া করে পরে চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
