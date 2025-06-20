module.exports.config = {
  name: "pair",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "একজন র‍্যান্ডম ইউজারের সাথে জুটি তৈরি করে",
  commandCategory: "fun",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dir = __dirname + `/cache/canvas/`;
  const file = resolve(dir, 'pairing.png');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(file)) await downloadFile("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", file);
};

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  const jimp = require("jimp");

  const canvasPath = path.resolve(__dirname, "cache/canvas");
  const bg = await jimp.read(`${canvasPath}/pairing.png`);
  const imgPath = `${canvasPath}/pair_${one}_${two}.png`;
  const avt1 = `${canvasPath}/avt_${one}.png`;
  const avt2 = `${canvasPath}/avt_${two}.png`;

  const url1 = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const url2 = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  fs.writeFileSync(avt1, Buffer.from((await axios.get(url1, { responseType: "arraybuffer" })).data, "utf-8"));
  fs.writeFileSync(avt2, Buffer.from((await axios.get(url2, { responseType: "arraybuffer" })).data, "utf-8"));

  const circle1 = await jimp.read(await circle(avt1));
  const circle2 = await jimp.read(await circle(avt2));
  bg.composite(circle1.resize(150, 150), 980, 200).composite(circle2.resize(150, 150), 140, 200);

  fs.writeFileSync(imgPath, await bg.getBufferAsync("image/png"));
  fs.unlinkSync(avt1);
  fs.unlinkSync(avt2);

  return imgPath;
}

module.exports.run = async function ({ api, event }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const { threadID, messageID, senderID } = event;

  const percentList = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', '0%', '48%'];
  const matchPercent = percentList[Math.floor(Math.random() * percentList.length)];

  const threadInfo = await api.getThreadInfo(threadID);
  const others = threadInfo.participantIDs.filter(id => id !== senderID);
  const partnerID = others[Math.floor(Math.random() * others.length)];

  const users = await api.getUserInfo([senderID, partnerID]);
  const name1 = users[senderID].name;
  const name2 = users[partnerID].name;

  const mentions = [
    { id: senderID, tag: name1 },
    { id: partnerID, tag: name2 }
  ];

  const imagePath = await makeImage({ one: senderID, two: partnerID });

  return api.sendMessage({
    body: `❤️‍🔥 𝑷𝒂𝒊𝒓 𝑴𝒂𝒕𝒄𝒉 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍!\n\n👩‍❤️‍👨 ${name1} ❤️ ${name2}\n📊 Match Score: ${matchPercent}\n✨ তুমি কি জানো? কখনো কখনো অদ্ভুত জুটিই হয়ে যায় সবচেয়ে সুন্দর গল্পের শুরু!`,
    mentions,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
