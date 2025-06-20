module.exports.config = {
  name: "xavier",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑀_ ☢️",
  description: "Write your text on Xavier's board",
  commandCategory: "edit-img",
  usages: "xavier [your text]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);

    const words = text.split(' ');
    const lines = [];
    let line = '';

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
        line = '';
      }

      if (words.length === 0) lines.push(line.trim());
    }

    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const text = args.join(" ");
  if (!text) return api.sendMessage("📝 Xavier-র বোর্ডে লেখার জন্য কিছু টাইপ করুন!", threadID, messageID);

  const backgroundUrl = "https://i.imgur.com/21xuPR1.jpg";
  const imgPath = __dirname + "/cache/xavier_board.png";

  const imageData = (await axios.get(backgroundUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(imgPath, Buffer.from(imageData, "utf-8"));

  const baseImage = await loadImage(imgPath);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";

  // Optional: Auto adjust font if text is too long
  let fontSize = 32;
  while (ctx.measureText(text).width > 1100) {
    fontSize--;
    ctx.font = `bold ${fontSize}px Arial`;
  }

  const lines = await this.wrapText(ctx, text, 1160);
  ctx.fillText(lines.join('\n'), 30, 270);

  const finalBuffer = canvas.toBuffer();
  fs.writeFileSync(imgPath, finalBuffer);

  return api.sendMessage({
    body: "📋 Here's your board!",
    attachment: fs.createReadStream(imgPath)
  }, threadID, () => fs.unlinkSync(imgPath), messageID);
};
