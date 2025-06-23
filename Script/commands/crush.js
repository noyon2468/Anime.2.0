const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports.config = {
  name: "crush",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ & ChatGPT",
  description: "ক্রাশ পেয়ার ছবি তৈরি করো মেনশন করা ইউজারদের থেকে",
  commandCategory: "fun",
  usages: "@mention",
  cooldowns: 5,
  dependencies: {
    axios: "",
    "fs-extra": "",
    path: "",
    jimp: ""
  }
};

module.exports.onLoad = async () => {
  const dirPath = path.join(__dirname, "cache/canvas/crush");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const bgPath = path.join(dirPath, "crush.png");
  const bgUrl = "https://i.imgur.com/PlVBaM1.jpg"; // Crush Background Image

  if (!fs.existsSync(bgPath)) {
    const response = await axios.get(bgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(response.data, "binary"));
  }
};

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const dirPath = path.join(__dirname, "cache/canvas/crush");
  const bgPath = path.join(dirPath, "crush.png");
  const pathOne = path.join(dirPath, `${one}_avt.png`);
  const pathTwo = path.join(dirPath, `${two}_avt.png`);
  const outputPath = path.join(dirPath, `${one}_${two}_crush_result.png`);

  // Download profile pictures
  const avtOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=1`, { responseType: "arraybuffer" })).data;
  const avtTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=1`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(pathOne, Buffer.from(avtOne, "binary"));
  fs.writeFileSync(pathTwo, Buffer.from(avtTwo, "binary"));

  const bg = await jimp.read(bgPath);
  const img1 = await jimp.read(await circle(pathOne));
  const img2 = await jimp.read(await circle(pathTwo));

  img1.resize(180, 180);
  img2.resize(180, 180);

  bg.composite(img1, 160, 130); // left
  bg.composite(img2, 400, 130); // right

  const final = await bg.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, final);

  // Cleanup
  fs.unlinkSync(pathOne);
  fs.unlinkSync(pathTwo);

  return outputPath;
}

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length < 1) {
    return api.sendMessage("❌ কারো সাথে ক্রাশ মিলাতে হলে তাকে মেনশন করো!", threadID, messageID);
  }

  const one = senderID;
  const two = mentionIDs[0];

  const imgPath = await makeImage({ one, two });

  const msg = {
    body:
      "✧•❁𝐂𝐫𝐮𝐬𝐡❁•✧\n\n" +
      "✶⊶⊷⊷❍⊷⊶⊷⊷✶\n" +
      `🫥\nতুমি আর ${mentions[two].replace("@", "")} একে অপরের ক্রাশ হতে পারো 💘\n` +
      "⊶⊷⊷✶\n\n" +
      "𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 💘\n\n" +
      "╚═══❖••❤️‍🔥••❖═══╝",
    attachment: fs.createReadStream(imgPath)
  };

  return api.sendMessage(msg, threadID, () => fs.unlinkSync(imgPath), messageID);
};
