module.exports.config = {
  name: "autotime",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER ☢️ + ChatGPT",
  description: "নির্দিষ্ট সময় অনুযায়ী ইসলামিক বার্তা পাঠায়।",
  commandCategory: "auto-system",
  usages: "[]",
  cooldowns: 3
};

const timeMessages = [
  { time: "5:00:00 AM", message: "🌄 ফজরের আজান হয়ে গেছে, সবাই নামাজ পড়ে নাও।\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" },
  { time: "7:00:00 AM", message: "🏫 স্কুল-কলেজে যাওয়ার সময়, প্রস্তুত হও সবাই!\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" },
  { time: "12:00:00 PM", message: "🍽️ দুপুরের খাবারের সময়, খেয়ে নাও এবং যোহরের নামাজ পড়ে ফেলো।\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" },
  { time: "3:00:00 PM", message: "🕒 আসরের নামাজের সময় হয়ে গেছে। সবাই প্রস্তুত হও।\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" },
  { time: "6:00:00 PM", message: "🌇 সন্ধ্যার সময়, সবাই কিছুক্ষণ আল্লাহকে স্মরণ করো।\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" },
  { time: "8:00:00 PM", message: "🛏️ ঘুমানোর আগে মাগরিব এবং এশার নামাজ পড়ে নিও।\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" },
  { time: "1:00:00 AM", message: "🌙 এখন গভীর রাত, ঘুমিয়ে পড়ো আর স্বপ্নে জান্নাত দেখো ইনশাআল্লাহ।\n\n𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁" }
];

module.exports.onLoad = o => {
  setInterval(async () => {
    const now = new Date().toLocaleTimeString("en-US", { hour12: false, timeZone: "Asia/Dhaka" });

    const foundTime = timeMessages.find(item => item.time === now);
    if (!foundTime) return;

    const allThreads = global.data.allThreadID || [];

    for (const threadID of allThreads) {
      o.api.sendMessage(foundTime.message, threadID);
    }

  }, 1000); // প্রতি 1 সেকেন্ডে সময় চেক করবে
};

module.exports.run = () => {};
