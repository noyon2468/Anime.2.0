const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "obama",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Generate an Obama tweet style image",
  commandCategory: "edit-img",
  usages: "obama [text]",
  cooldowns: 10,
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
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
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

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.join(" ");
  if (!text) return api.sendMessage("📝 কী লিখবে সেটা দাও!\n\nউদাহরণ: obama আমি বাংলাদেশের গর্ব!", threadID, messageID);

  const pathImg = __dirname + "/cache/obama_tweet.png";
  const imageURL = "https://i.imgur.com/6fOxdex.png";

  try {
    const imageData = (await axios.get(imageURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(imageData, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 45px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    const lines = await this.wrapText(ctx, text, 1160);
    ctx.fillText(lines.join("\n"), 60, 165); // main tweet text

    const finalImage = canvas.toBuffer();
    fs.writeFileSync(pathImg, finalImage);

    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  } catch (e) {
    console.error("❌ Error creating obama image:", e);
    return api.sendMessage("❌ ওপ্স! ছবিটা বানাতে সমস্যা হচ্ছে। আবার চেষ্টা করো।", threadID, messageID);
  }
};
