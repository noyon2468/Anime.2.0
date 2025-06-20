const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Nur Muhammad + ChatGPT",
  description: "Show bot prefix and info",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body || body.toLowerCase().trim() !== "prefix") return;

  const start = Date.now();
  const dayRaw = moment.tz("Asia/Dhaka").format("dddd");
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss | D/MM/YYYY");

  const weekMap = {
    Sunday: "রবিবার",
    Monday: "সোমবার",
    Tuesday: "মঙ্গলবার",
    Wednesday: "বুধবার",
    Thursday: "বৃহস্পতিবার",
    Friday: "শুক্রবার",
    Saturday: "শনিবার",
  };

  const day = weekMap[dayRaw] || dayRaw;
  const prefix = global.config.PREFIX || "/";
  const botname = global.config.BOTNAME || "Messenger Bot";
  const ping = Date.now() - start;

  const imageLinks = [
    "https://i.imgur.com/QdgH08j6.jpg",
    "https://i.imgur.com/ksuAxtx.jpg",
    "https://i.imgur.com/8tNmUVM.jpg"
  ];
  const chosenImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
  const imgPath = path.join(__dirname, "cache", "prefix_nur.jpg");

  request(chosenImage)
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => {
      const msg = 
`╔═════[ ⚙️ 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾 ⚙️ ]═════╗
┃👑 Bot Owner: নূর মোহাম্মদ
┃🔗 FB: fb.com/nur.mohammad.367314
┃🤖 Bot Name: ${botname}
┃💬 Group Prefix: ${prefix}
┃📊 Commands: ${global.commands.size || "N/A"}
┃📡 Ping: ${ping}ms
┃📅 Day: ${day}
┃⏰ Time: ${time}
╚═════════════════════╝`;

      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => fs.unlinkSync(imgPath), messageID);
    });
};

module.exports.run = async () => {};
