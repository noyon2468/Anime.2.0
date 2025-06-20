const axios = require("axios");
const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
  name: "playstore",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Make stylish profile image like playstore banner",
  commandCategory: "user",
  usages: "[mention or blank]",
  cooldowns: 2,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);

    const words = text.split(" ");
    const lines = [];
    let line = "";

    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = temp.slice(-1) + words[1];
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }

      if (ctx.measureText(line + words[0]).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = "";
      }

      if (words.length === 0) lines.push(line.trim());
    }

    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const pathImg = __dirname + "/cache/playstore_img.png";
    const pathAvt = __dirname + "/cache/playstore_avt.png";

    const uid = Object.keys(event.mentions)[0] || event.senderID;
    const name = await Users.getNameUser(uid);

    const bgLinks = [
      "https://i.imgur.com/KDKgqvq.png"
    ];
    const bgURL = bgLinks[Math.floor(Math.random() * bgLinks.length)];

    const avtData = (
      await axios.get(`https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, {
        responseType: "arraybuffer"
      })
    ).data;
    fs.writeFileSync(pathAvt, Buffer.from(avtData, "utf-8"));

    const bgData = (
      await axios.get(bgURL, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(bgData, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const baseAvt = await loadImage(pathAvt);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "start";

    const lines = await this.wrapText(ctx, name, 1160);
    ctx.fillText(lines.join('\n'), 200, 150);

    ctx.beginPath();
    ctx.arc(100, 175, 35, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(baseAvt, 65, 140, 70, 70);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.unlinkSync(pathAvt);

    return api.sendMessage({
      body: "✨ Here's your Playstore-style image!",
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ কিছু সমস্যা হয়েছে ছবিটি তৈরি করতে।", event.threadID, event.messageID);
  }
};
