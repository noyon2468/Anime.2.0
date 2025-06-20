const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

const links = [
  "https://i.imgur.com/bbigbCj.mp4"
];

module.exports.config = {
  name: "🥺",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Nur Muhammad + Islamick Chat",
  description: "🥺 লিখলে ভিডিও সহ রোমান্টিক রেপ্লাই",
  commandCategory: "noprefix",
  usages: "🥺",
  cooldowns: 5,
  dependencies: {
    request: "",
    "fs-extra": "",
    axios: ""
  }
};

// 🥺 Handle No Prefix
module.exports.handleEvent = async ({ api, event, Threads }) => {
  const { threadID, body, messageID } = event;
  if (!body || !body.toLowerCase().startsWith("🥺")) return;

  // Check if feature is off for this thread
  const threadData = (await Threads.getData(threadID)).data || {};
  if (threadData["🥺"] === false) return;

  const responses = [
    "╭•┄┅════❁🌺❁════┅┄•╮\n\nআমি বলবো কেমন করে আমার শরিলের লোম দারিয়ে যায়-!!🥺\n\n╰•┄┅════❁🌺❁════┅┄•╯",
    "╭•┄┅════❁🌺❁════┅┄•╮\n\nতোমার ওই একটুখানি মুখের এক্সপ্রেশন 😩 আমার বুকের ভিতরে ঝড় তোলে...\n\n╰•┄┅════❁🌺❁════┅┄•╯"
  ];

  const videoURL = links[Math.floor(Math.random() * links.length)];
  const msgText = responses[Math.floor(Math.random() * responses.length)];
  const filePath = __dirname + "/cache/🥺.mp4";

  const callback = () => api.sendMessage({
    body: msgText,
    attachment: fs.createReadStream(filePath)
  }, threadID, () => fs.unlinkSync(filePath), messageID);

  request(encodeURI(videoURL))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback);
};

// 🥺 Toggle command (on/off)
module.exports.run = async ({ api, event, Threads, getText }) => {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data || {};

  data["🥺"] = data["🥺"] === false ? true : false;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  const status = data["🥺"] ? "🥺 ফিচার এখন চালু ✅" : "🥺 ফিচার এখন বন্ধ ❌";
  return api.sendMessage(status, threadID, messageID);
};
