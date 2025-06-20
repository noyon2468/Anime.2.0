const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "🌍",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Islamick Chat - Modified by নূর মোহাম্মদ",
  description: "Send beautiful Islamic video when 🌍 or world is typed",
  commandCategory: "noprefix",
  usages: "🌍",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  const content = event.body ? event.body.toLowerCase() : "";
  if (
    content.startsWith("🌍") ||
    content.startsWith("🌎") ||
    content.startsWith("🌏") ||
    content.startsWith("🌐") ||
    content.includes("world")
  ) {
    const timeStart = Date.now();

    const link = [
      "https://i.imgur.com/O9JDYv0.mp4"
      // চাইলে আরও লিংক যোগ করতে পারো
    ];

    const filePath = __dirname + "/cache/world_islamic.mp4";
    const selectedLink = link[Math.floor(Math.random() * link.length)];

    const callback = () => {
      const timeTaken = Date.now() - timeStart;
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const prefix = global.config.PREFIX || "!";

      api.sendMessage({
        body: `🌍 আল্লাহর সৃষ্টির জগৎ সত্যিই বিস্ময়কর! 🌟\n\n📽️ ইসলামিক ভিডিও উপভোগ করুন 💖\n\n🕒 বট চালু: ${hours}h ${minutes}m ${seconds}s\n⏳ কমান্ড প্রসেস সময়: ${timeTaken}ms\n🛠️ Prefix: ${prefix}\n\n~ নূর মোহাম্মদ`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    };

    request(encodeURI(selectedLink))
      .pipe(fs.createWriteStream(filePath))
      .on("close", callback);
  }
};

module.exports.run = async ({ event, api, Threads }) => {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data;

  data["🌍"] = typeof data["🌍"] === "undefined" ? false : !data["🌍"];

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  api.sendMessage(`🌐 Islamic 🌍 command is now ${(data["🌍"] ? "ON ✅" : "OFF ❌")}`, threadID, messageID);
};
