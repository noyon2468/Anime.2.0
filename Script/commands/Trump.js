module.exports.config = {
  name: "trump",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "🧠 ট্রাম্পের ছবিতে তোমার লেখা যুক্ত করো!",
  commandCategory: "image-edit",
  usages: "trump [তোমার টেক্সট]",
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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

module.exports.run = async function({ api, event, args }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const pathImg = __dirname + "/cache/trump.png";

  const text = args.join(" ");
  if (!text) return api.sendMessage("✍️ দয়া করে ট্রাম্পের জন্য একটা কথা লিখো!", event.threadID, event.messageID);

  const imgResponse = await axios.get("https://i.imgur.com/ZtWfHHx.png", { responseType: "arraybuffer" });
  fs.writeFileSync(pathImg, Buffer.from(imgResponse.data, "utf-8"));

  const baseImage = await loadImage(pathImg);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";

  const lines = await this.wrapText(ctx, text, 1150);
  ctx.fillText(lines.join('\n'), 60, 165);

  const finalBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, finalBuffer);

  return api.sendMessage({
    body: `🇺🇸 ট্রাম্প বলছে:\n"${text}"`,
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
