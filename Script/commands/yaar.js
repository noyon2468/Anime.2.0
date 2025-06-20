module.exports.config = {
  name: "yaar",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Make pair image with tagged user",
  commandCategory: "image",
  usages: "yaar [@mention]",
  cooldowns: 5,
  dependencies: {
    axios: "",
    "fs-extra": "",
    path: "",
    jimp: ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(dirMaterial, 'yaar_bg.png');
  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/2bY5bSV.jpg", path);
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let template = await jimp.read(path.join(__root, "yaar_bg.png"));
  const pathImg = path.join(__root, `yaar_${one}_${two}.png`);
  const avatarOne = path.join(__root, `avt_${one}.png`);
  const avatarTwo = path.join(__root, `avt_${two}.png`);

  const getAvatar = async (uid, outPath) => {
    const imgData = (await axios.get(
      `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(outPath, Buffer.from(imgData, 'utf-8'));
  };

  await getAvatar(one, avatarOne);
  await getAvatar(two, avatarTwo);

  const avatarCircleOne = await jimp.read(await circle(avatarOne));
  const avatarCircleTwo = await jimp.read(await circle(avatarTwo));

  template
    .composite(avatarCircleOne.resize(191, 191), 93, 111)
    .composite(avatarCircleTwo.resize(190, 190), 434, 107);

  const finalImage = await template.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, finalImage);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(imagePath) {
  const jimp = require("jimp");
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0])
    return api.sendMessage("👤 দয়া করে কাউকে ট্যাগ করুন জুটির জন্য।", threadID, messageID);

  const one = senderID;
  const two = mention[0];

  try {
    const imgPath = await makeImage({ one, two });
    const message = {
      body: "💘 𝑌𝑎𝑎𝑟 𝐿𝑜𝑣𝑒 𝐵𝑜𝑛𝑑 ✨\n\n𝐘𝐨𝐮 𝐚𝐧𝐝 𝐲𝐨𝐮𝐫 𝐭𝐚𝐠𝐠𝐞𝐝 𝐛𝐞𝐬𝐭𝐢𝐞 𝐚𝐫𝐞 𝐧𝐨𝐰 𝐏𝐚𝐢𝐫𝐞𝐝 💞",
      attachment: fs.createReadStream(imgPath)
    };
    return api.sendMessage(message, threadID, () => fs.unlinkSync(imgPath), messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।", threadID, messageID);
  }
};
