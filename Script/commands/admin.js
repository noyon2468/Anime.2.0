const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "admin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  const callback = () => api.sendMessage({
    body: `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃     💠 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 💠    
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 👑 𝐍𝐚𝐦𝐞       : নূর মোহাম্মদ
┃ 📍 𝐅𝐫𝐨𝐦       : বাংলাদেশ
┃ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧   : ইসলাম ☪️
┃ 💬 𝐋𝐚𝐧𝐠𝐮𝐚𝐠𝐞 : বাংলা, English
┃ ❤️ 𝐒𝐭𝐚𝐭𝐮𝐬    : Alhamdulillah, I’m Fine
┃ 🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤  : fb.com/nur.mohammad.367314
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝   : ${time}
┗━━━━━━━━━━━━━━━━━━━━━┛
    `,
    attachment: fs.createReadStream(__dirname + "/cache/nur_profile.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/nur_profile.jpg"));

  return request(encodeURI(`https://graph.facebook.com/100035389598342/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
    .pipe(fs.createWriteStream(__dirname + "/cache/nur_profile.jpg"))
    .on("close", () => callback());
};
