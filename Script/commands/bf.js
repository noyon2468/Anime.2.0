const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "bf",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "রোমান্টিক প্রেমিক জোড়া তৈরি করে ❤️",
  commandCategory: "fun",
  usages: "Tag two users",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const dir = __dirname + "/cache/canvas";
  const imgPath = path.join(dir, "arr2.png");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(imgPath)) {
    const img = (await axios.get("https://i.imgur.com/iaOiAXe.jpg", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(imgPath, Buffer.from(img, "utf-8"));
  }
};

async function circle(imagePath) {
  const img = await jimp.read(imagePath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const basePath = __dirname + "/cache/canvas";
  const baseImage = await jimp.read(basePath + "/arr2.png");

  const oneAvt = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=178743elrasN379%7Cc1e620fa708a1d1bde56625696fb991c`, { responseType: "arraybuffer" });
  const twoAvt = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=178743elrasN379%7Cc1e620fa708a1d1bde56625696fb991c`, { responseType: "arraybuffer" });

  const onePath = basePath + `/avt_${one}_${two}.png`;
  const twoPath = basePath + `/avt_${two}_${one}.png`;
  fs.writeFileSync(onePath, Buffer.from(oneAvt.data, "utf-8"));
  fs.writeFileSync(twoPath, Buffer.from(twoAvt.data, "utf-8"));

  const circleOne = await circle(onePath);
  const circleTwo = await circle(twoPath);

  const avatar1 = await jimp.read(circleOne);
  const avatar2 = await jimp.read(circleTwo);

  baseImage
    .composite(avatar1.resize(150, 150), 50, 170)
    .composite(avatar2.resize(150, 150), 360, 170);

  const finalPath = basePath + `/pair_${one}_${two}.png`;
  await baseImage.writeAsync(finalPath);

  fs.unlinkSync(onePath);
  fs.unlinkSync(twoPath);

  return finalPath;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const tag = Object.keys(mentions);

  if (tag.length < 1) return api.sendMessage("🥲 মেনশন দে কার সাথে জোড়া বানাবো!", threadID, messageID);

  const one = senderID;
  const two = tag[0];

  const imagePath = await makeImage({ one, two });

  const caption = `╔═══❖••°°••❖═══╗
❤️ আজ থেকে তোমরা শুধু বন্ধু না,
হৃদয়ের সবচেয়ে কাছের মানুষ!

🌹 মনের মতো একজনকে পেয়ে,
জীবনের প্রতিটা দিন হোক ভালোবাসায় ভরা।

⏳ ঝগড়া, মান অভিমান আসবে,
তবুও ভালোবাসা যেন না হারায়…

👫 একসাথে পথ চলার শুরু হোক আজ থেকেই!
╚═══❖••°°••❖═══╝
[       💘       ]`;

  return api.sendMessage({
    body: caption,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
