const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "inbox",
  version: "2.0.0",
  hasPermission: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Send random sad video from internet with /next support",
  commandCategory: "media",
  usages: "[inbox | /next]",
  cooldowns: 3
};

let cache = {};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const res = await axios.get("https://raw.githubusercontent.com/nurumohammad-dev/sk2-bot-database/main/sadvideo.json");
  const videoList = res.data.videos || [];

  if (videoList.length === 0) return api.sendMessage("❌ ভিডিও ডেটাবেস খালি!", threadID, messageID);

  const index = Math.floor(Math.random() * videoList.length);
  const chosen = videoList[index];
  const videoURL = chosen.url;
  const caption = chosen.caption || "😢 Sad Video";

  const path = __dirname + `/cache/sad.mp4`;
  const data = (await axios.get(videoURL, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(path, Buffer.from(data, "utf-8"));

  const msg = {
    body: `${caption}\n\n📌 Use /next to see another.`,
    attachment: fs.createReadStream(path)
  };

  api.sendMessage(msg, threadID, async (err, info) => {
    cache[threadID] = { last: videoURL };
    fs.unlinkSync(path);
  }, messageID);
};

module.exports.handleReply = async function({ api, event }) {
  const { body, threadID, messageID } = event;
  if (body?.toLowerCase() === "/next") {
    module.exports.run({ api, event, args: [] });
  }
};
