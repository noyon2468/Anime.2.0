module.exports.config = {
  name: "botinfo",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "বট এর সকল তথ্য দেখায়",
  commandCategory: "system",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function({ api, event }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  const uptime = process.uptime();
  const hours = Math.floor(uptime / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  const now = moment.tz("Asia/Dhaka").format("D/MM/YYYY — HH:mm:ss");

  const ownerUID = "100035389598342"; // তোমার UID
  const ownerLink = `https://www.facebook.com/${ownerUID}`;
  const ownerInfo = await api.getUserInfo(ownerUID);
  const ownerName = ownerInfo[ownerUID].name;

  const imgLinks = [
    "https://i.imgur.com/QdgH08j6/wa1.jpg",
    "https://i.imgur.com/gSW285Z.gif"
  ];
  const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];

  const callback = () => api.sendMessage({
    body: 
`╭──────•◈•──────╮
🌸 BOT INFORMATION 🌸
╰──────•◈•──────╯

📛 Bot Name: ${global.config.BOTNAME}
👤 Owner: ${NurMuhammad}
🔗 Profile: ${https://www.facebook.com/nur.mohammad.367314?mibextid=ZbWKwL}
📅 Date: ${now}
⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s

📌 Powered by: 
╰─────────────╯`,
    attachment: fs.createReadStream(__dirname + "/cache/botinfo.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/botinfo.jpg"), event.messageID);

  return request(encodeURI(imgLink))
    .pipe(fs.createWriteStream(__dirname + "/cache/botinfo.jpg"))
    .on("close", () => callback());
};
