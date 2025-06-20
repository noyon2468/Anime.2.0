const axios = require('axios');
const fs = require("fs");
const request = require("request");

const videoCategories = [
  "status", "sad", "baby", "love", "ff", "shairi", "humaiyun",
  "islam", "anime", "short", "event", "prefix", "cpl", "time",
  "lofi", "happy", "football", "funny"
];

module.exports.config = {
  name: "videomix",
  version: "12.5.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + Shaon Ahmed",
  description: "র‍্যান্ডম ভিডিও / নির্দিষ্ট ক্যাটাগরির ভিডিও / /next",
  commandCategory: "video",
  usages: "[category] | /next",
  cooldowns: 10
};

let lastCategory = {};

module.exports.run = async function({ api, event, args }) {
  try {
    const { threadID, messageID, senderID } = event;
    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const baseUrl = apis.data.api;

    let category = args[0]?.toLowerCase();

    if (category === "/next") {
      category = lastCategory[senderID];
      if (!category) return api.sendMessage("❌ আগের কোনো ক্যাটাগরি খুঁজে পাওয়া গেল না। আগে একটি ভিডিও চালাও।", threadID, messageID);
    }

    if (!category || !videoCategories.includes(category)) {
      category = videoCategories[Math.floor(Math.random() * videoCategories.length)];
    }

    lastCategory[senderID] = category;

    const res = await axios.get(`${baseUrl}/video/${category}`);
    const videoUrl = res.data.data;
    const count = res.data.count || "Unknown";
    const name = res.data.shaon || "Unnamed";
    const ext = videoUrl.substring(videoUrl.lastIndexOf(".") + 1);
    const filePath = `${__dirname}/cache/videomix.${ext}`;

    const callback = () => {
      api.sendMessage({
        body: `🎬 𝗦𝗣𝗔𝗬𝗦𝗛𝗘𝗔𝗟 𝗩𝗶𝗱𝗲𝗼 𝗠𝗜𝗫 🎞️\n\n📌 নাম: ${name}\n📁 মোট ভিডিও: ${count}টি\n📂 ক্যাটাগরি: ${category}\n\n🔁 আবার দেখতে: /videomix /next`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);
    };

    request(videoUrl).pipe(fs.createWriteStream(filePath)).on("close", callback);
  } catch (err) {
    console.error(err);
    return api.sendMessage("😢 ভিডিও আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন!", event.threadID, event.messageID);
  }
};
