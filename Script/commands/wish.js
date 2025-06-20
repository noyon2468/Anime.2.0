const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { loadImage, createCanvas } = require('@napi-rs/canvas');

module.exports.config = {
  name: "wish",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "🎂 জন্মদিনের সুন্দর ডিজাইন সহ শুভেচ্ছা জানান",
  commandCategory: "birthday",
  usages: "[mention/tag]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
  const senderID = event.senderID;
  const name = await Users.getNameUser(senderID);

  // ব্যাকগ্রাউন্ড এবং প্রোফাইল ছবির লোকেশন
  const backgroundPath = path.join(__dirname, 'cache', 'birthday_bg.png');
  const avatarPath = path.join(__dirname, 'cache', 'avatar.png');

  // প্রোফাইল লিংক থেকে ইউজারের ছবি ডাউনলোড
  const avatarURL = `https://graph.facebook.com/${senderID}/picture?width=720&height=720`;
  const backgroundURL = "https://i.imgur.com/5KJReXN.jpeg"; // এইটা তুমি চাইলে যেকোনো পছন্দের ব্যাকগ্রাউন্ড দিতে পারো

  const avatarData = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
  const bgData = (await axios.get(backgroundURL, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(avatarPath, Buffer.from(avatarData, "utf-8"));
  fs.writeFileSync(backgroundPath, Buffer.from(bgData, "utf-8"));

  const avatarImg = await loadImage(avatarPath);
  const bgImg = await loadImage(backgroundPath);

  const canvas = createCanvas(bgImg.width, bgImg.height);
  const ctx = canvas.getContext("2d");

  // Draw Background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Draw Avatar
  const avatarSize = 250;
  ctx.beginPath();
  ctx.arc(150 + avatarSize / 2, 100 + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatarImg, 150, 100, avatarSize, avatarSize);
  ctx.restore();

  // Draw Text
  ctx.font = "40px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`🎉 শুভ জন্মদিন ${name}! 🎂`, canvas.width / 2, 420);

  const finalImage = canvas.toBuffer("image/png");
  const imagePath = path.join(__dirname, 'cache', `bday_${senderID}.png`);
  fs.writeFileSync(imagePath, finalImage);

  // Send Message
  const message = {
    body: `🌸 শুভ জন্মদিন ${name}!\n\nতোমার জীবনে সুখ, শান্তি আর সফলতা বর্ষিত হোক প্রতিদিন! 🌟`,
    attachment: fs.createReadStream(imagePath)
  };

  api.sendMessage(message, event.threadID, () => {
    fs.unlinkSync(imagePath);
    fs.unlinkSync(avatarPath);
    fs.unlinkSync(backgroundPath);
  }, event.messageID);
};
