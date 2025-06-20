module.exports.config = {
  name: "arrest",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + MAHBUB SHAON",
  description: "একজন বন্ধুকে আটকাও মজার ভঙ্গিতে",
  commandCategory: "fun-tag",
  usages: "@mention",
  cooldowns: 2,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dir = __dirname + `/cache/canvas/`;
  const imgPath = resolve(dir, 'arrest_bg.png');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(imgPath)) await downloadFile("https://i.imgur.com/ep1gG3r.png", imgPath);
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const root = path.resolve(__dirname, "cache", "canvas");

  const baseImg = await jimp.read(root + "/arrest_bg.png");
  const outPath = root + `/arrest_${one}_${two}.png`;
  const avatar1 = root + `/avt_${one}.png`;
  const avatar2 = root + `/avt_${two}.png`;

  const res1 = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
  fs.writeFileSync(avatar1, Buffer.from(res1.data, 'utf-8'));

  const res2 = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
  fs.writeFileSync(avatar2, Buffer.from(res2.data, 'utf-8'));

  const circle1 = await jimp.read(await circle(avatar1));
  const circle2 = await jimp.read(await circle(avatar2));

  baseImg.resize(500, 500)
    .composite(circle1.resize(100, 100), 375, 9)
    .composite(circle2.resize(100, 100), 160, 92);

  const finalBuffer = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(outPath, finalBuffer);
  fs.unlinkSync(avatar1);
  fs.unlinkSync(avatar2);
  return outPath;
}

async function circle(imgPath) {
  const jimp = require("jimp");
  const img = await jimp.read(imgPath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions)[0];
  const tag = event.mentions[mention]?.replace("@", "") || "বন্ধু";

  if (!mention) return api.sendMessage("⚠️ একজনকে মেনশন করো যাকে আটকাতে চাও!", threadID, messageID);

  const path = await makeImage({ one: senderID, two: mention });
  return api.sendMessage({
    body: `🚨 গ্রেফতার অভিযান সফল 🚨\n\n👉 ${tag} হালায় গরু চুরি করছিলো! এখন ধরা খাইছে পুলিশের হাতে 😂\n\n📸 প্রমাণ সহ ছবি নিচে দেওয়া হলো:\n\n🌀 কাস্টমাইজড বাই: নূর মোহাম্মদ`,
    mentions: [{ tag: tag, id: mention }],
    attachment: fs.createReadStream(path)
  }, threadID, () => fs.unlinkSync(path), messageID);
};
