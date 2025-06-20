//learn to eat, learn to speak, don't learn the habit of replacing credits
module.exports.config = {
  name: "zuck",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Write text on zuck's board",
  commandCategory: "edit-img",
  usages: "zuck [text]",
  cooldowns: 5,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const text = args.join(" ");
  if (!text) return api.sendMessage("📌 বোর্ডে লেখার জন্য কিছু টেক্সট দিন!", threadID, messageID);

  const pathImg = __dirname + '/cache/zuck.jpg';
  const bgImg = "https://i.postimg.cc/gJCXgKv4/zucc.jpg";

  try {
    const image = (await axios.get(bgImg, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(image, 'utf-8'));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Font setup
    let fontSize = 20;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "start";

    const lines = await this.wrapText(ctx, text, 470);
    let y = 75;
    for (let line of lines) {
      ctx.fillText(line, 20, y);
      y += fontSize + 5;
    }

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage({
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।", threadID, messageID);
  }
};
