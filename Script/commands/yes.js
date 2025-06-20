module.exports.config = {
  name: "yes",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "বোর্ডে সুন্দর বাংলা লেখার সাথে টাইম, নাম, ইমোজি",
  commandCategory: "fun",
  usages: "[মেসেজ]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "moment-timezone": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
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
};

module.exports.run = async function ({ api, event, args, Users }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const moment = require("moment-timezone");

  const fontPath = __dirname + "/cache/NotoSansBengali.ttf";
  const pathImg = __dirname + "/cache/yes.png";

  // Bengali Font Load
  if (!fs.existsSync(fontPath)) {
    const fontData = await axios.get("https://github.com/google/fonts/raw/main/ofl/notosansbengali/NotoSansBengali-Regular.ttf", { responseType: "arraybuffer" });
    fs.writeFileSync(fontPath, Buffer.from(fontData.data, "utf-8"));
  }
  registerFont(fontPath, { family: "Bangla" });

  // Random backgrounds
  const backgrounds = [
    "https://i.ibb.co/GQbRhkY/Picsart-22-08-14-17-32-11-488.jpg",
    "https://i.ibb.co/WfP1wTD/board1.jpg",
    "https://i.ibb.co/tsH2YFH/board2.jpg",
    "https://i.ibb.co/ZgRgTxh/board3.jpg"
  ];
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const imgData = (await axios.get(bg, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(imgData, 'utf-8'));

  const text = args.join(" ") || (event.messageReply && event.messageReply.body);
  if (!text) return api.sendMessage("📢 দয়া করে বোর্ডে লেখার জন্য কিছু লিখুন!", event.threadID, event.messageID);

  const baseImage = await loadImage(pathImg);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  ctx.textAlign = "start";
  ctx.fillStyle = "#000000";
  ctx.font = "bold 36px Bangla";

  const lines = await this.wrapText(ctx, text, 350);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 280, 70 + i * 45);
  }

  // Sender Name
  const name = (await Users.getNameUser(event.senderID)) || "ব্যবহারকারী";
  ctx.font = "bold 24px Bangla";
  ctx.fillText(`👤 ${name}`, 25, canvas.height - 70);

  // Time
  const banglaTime = moment.tz("Asia/Dhaka").format("hh:mm A");
  ctx.fillText(`⏰ ${banglaTime}`, 25, canvas.height - 40);

  // Greeting
  const hour = moment.tz("Asia/Dhaka").hour();
  let greet = "🌙 শুভ রাত্রি";
  if (hour >= 5 && hour < 12) greet = "🌞 শুভ সকাল";
  else if (hour >= 12 && hour < 17) greet = "🌤️ শুভ দুপুর";
  else if (hour >= 17 && hour < 20) greet = "🌇 শুভ সন্ধ্যা";

  ctx.font = "bold 20px Bangla";
  ctx.fillText(greet, canvas.width - 180, canvas.height - 40);

  const finalImage = canvas.toBuffer();
  fs.writeFileSync(pathImg, finalImage);
  return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
