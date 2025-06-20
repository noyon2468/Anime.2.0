const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "pair",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "সবার জন্য একটাই জোড়া command: প্রেম, বন্ধুত্ব, বিয়ে, ক্রাশ, শত্রু ও মজার মিল",
  commandCategory: "ভালোবাসা",
  cooldowns: 5,
  usages: "[romantic/funny/crush/marry/bestie/enemy]",
  dependencies: {}
};

module.exports.onLoad = async () => {
  const dir = __dirname + "/cache/canvas/";
  const bg = path.join(dir, "pair_bg.jpg");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(bg)) {
    const res = await axios.get("https://i.pinimg.com/originals/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", { responseType: "arraybuffer" });
    fs.writeFileSync(bg, Buffer.from(res.data));
  }
};

async function circle(imagePath) {
  const img = await jimp.read(imagePath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

async function makeImage({ uid1, uid2 }) {
  const canvasDir = path.join(__dirname, "cache", "canvas");
  const bg = await jimp.read(path.join(canvasDir, "pair_bg.jpg"));

  const avatar1 = path.join(canvasDir, `avt_${uid1}.png`);
  const avatar2 = path.join(canvasDir, `avt_${uid2}.png`);
  const output = path.join(canvasDir, `pair_${uid1}_${uid2}.png`);

  const getAvt = async (id, file) => {
    const res = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
    fs.writeFileSync(file, Buffer.from(res.data, 'utf-8'));
  };

  await getAvt(uid1, avatar1);
  await getAvt(uid2, avatar2);

  const circ1 = await jimp.read(await circle(avatar1));
  const circ2 = await jimp.read(await circle(avatar2));

  bg.composite(circ1.resize(90, 90), 355, 100);
  bg.composite(circ2.resize(80, 80), 250, 140);

  const buf = await bg.getBufferAsync("image/png");
  fs.writeFileSync(output, buf);
  fs.unlinkSync(avatar1);
  fs.unlinkSync(avatar2);
  return output;
}

const modes = {
  romantic: {
    emoji: "💞",
    lines: [
      "{a} ❤️ {b} — আজকের স্বপ্নের জুটি! 💘\nমিলের সম্ভাবনা: {p}"
    ]
  },
  funny: {
    emoji: "😂",
    lines: [
      "😹 {a} আর {b} মিলে তৈরি হলো নতুন জোকার দম্পতি!\nসম্ভাবনা: {p}"
    ]
  },
  crush: {
    emoji: "💘",
    lines: [
      "😳 {a} এর গোপন ক্রাশ হলো {b}!\nতারা একে অপরকে জানে না, কিন্তু হৃদয়ে অনুভব করে 💗\nMatch: {p}"
    ]
  },
  marry: {
    emoji: "💍",
    lines: [
      "💐 {a} আজ বিয়ের প্রস্তাব দিলো {b} কে!\n💖 কেমন হবে এই বিয়ে? সম্ভাবনা: {p}"
    ]
  },
  bestie: {
    emoji: "🤝",
    lines: [
      "👯‍♂️ {a} আর {b} হলো আজকের Best Friends Forever!\nবন্ধুত্বের শক্তি: {p}"
    ]
  },
  enemy: {
    emoji: "😡",
    lines: [
      "💣 {a} আর {b} হলো আজকের মহা শত্রু! 🤺\nযুদ্ধে জেতার সম্ভাবনা: {p}"
    ]
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;
  const mode = args[0]?.toLowerCase() || "romantic";

  if (!modes[mode]) {
    return api.sendMessage(`❌ মোড "${mode}" খুঁজে পাওয়া যায়নি!\nব্যবহার করুন:\nromantic, funny, crush, marry, bestie, enemy`, threadID, messageID);
  }

  const thread = await api.getThreadInfo(threadID);
  const users = thread.participantIDs.filter(i => i !== senderID);
  const matchID = users[Math.floor(Math.random() * users.length)];
  const userInfo = await api.getUserInfo(senderID);
  const matchInfo = await api.getUserInfo(matchID);
  const nameA = userInfo[senderID].name;
  const nameB = matchInfo[matchID].name;
  const percent = Math.floor(Math.random() * 100) + 1 + "%";

  const imagePath = await makeImage({ uid1: senderID, uid2: matchID });

  const line = modes[mode].lines[Math.floor(Math.random() * modes[mode].lines.length)]
    .replace("{a}", nameA)
    .replace("{b}", nameB)
    .replace("{p}", percent);

  return api.sendMessage({
    body: `${modes[mode].emoji} ${line}`,
    attachment: fs.createReadStream(imagePath),
    mentions: [
      { id: senderID, tag: nameA },
      { id: matchID, tag: nameB }
    ]
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
