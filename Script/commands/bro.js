module.exports.config = {
  name: "brother",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "ভাই-বোনের ছবি তৈরি করে ❤️",
  commandCategory: "bonding",
  usages: "brother @mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = require("path");
  const { existsSync, mkdirSync } = require("fs-extra");
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'bro.png');
  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/n2FGJFe.jpg", path);
};

async function makeImage({ one, two }) {
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  const jimp = require("jimp");
  const __root = path.resolve(__dirname, "cache", "canvas");

  const bg = await jimp.read(__root + "/bro.png");
  const pathImg = __root + `/bro_${one}_${two}.png`;
  const avatarOne = __root + `/avt_${one}.png`;
  const avatarTwo = __root + `/avt_${two}.png`;

  const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  const circleOne = await jimp.read(await circle(avatarOne));
  const circleTwo = await jimp.read(await circle(avatarTwo));
  bg.composite(circleOne.resize(191, 191), 93, 111).composite(circleTwo.resize(190, 190), 434, 107);

  const raw = await bg.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
  const fs = require("fs-extra");
  const { threadID, messageID, senderID, mentions } = event;
  const mention = Object.keys(mentions);

  if (!mention[0]) {
    return api.sendMessage("⚠️ দয়া করে কারো নাম ট্যাগ করে ভাই-বোন ছবি তৈরি করুন!", threadID, messageID);
  }

  const one = senderID;
  const two = mention[0];

  return makeImage({ one, two }).then(path =>
    api.sendMessage({
      body:
`🌸 ভাই-বোনের চিরন্তন ভালোবাসা 🌸

🫂 ${mentions[two].replace("@", "")} & আপনি 🫂

🧣 দূরত্ব থাকলেও হৃদয় কখনো দূরে না যায়।
🧕 ভাই-বোন মানেই চিরদিনের বন্ধন, নির্ভরতা আর ভালোবাসা 💖

— ভালোবাসায়: নূর মোহাম্মদ`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID));
};
