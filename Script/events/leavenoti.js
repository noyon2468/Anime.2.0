module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.1.0",
  credits: "নূর মোহাম্মদ",
  description: "কেউ গ্রুপ ছাড়লে কাস্টম বিদায়ী মেসেজ দেয়",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "moment-timezone": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const gifPath = join(__dirname, "cache", "leaveGif", "randomgif");
  if (!existsSync(gifPath)) mkdirSync(gifPath, { recursive: true });
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const moment = require("moment-timezone");

  const { threadID, logMessageData, author } = event;
  const leftUID = logMessageData.leftParticipantFbId;

  if (leftUID == api.getCurrentUserID()) return;

  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
  const hours = parseInt(moment.tz("Asia/Dhaka").format("HH"));
  const session = hours < 11 ? "সকালের" : hours <= 16 ? "দুপুরের" : hours <= 19 ? "বিকালের" : "রাতের";
  const type = (author == leftUID) ? "নিজে চলে গেছেন" : "অ্যাডমিনের মাধ্যমে বাদ পড়েছেন";

  const userName = global.data.userName.get(leftUID) || await Users.getNameUser(leftUID);
  const threadData = global.data.threadData.get(threadID) || (await Threads.getData(threadID)).data;

  let msg = typeof threadData.customLeave == "undefined"
    ? `😢 ━━「 বিদায়ের ঘোষণা 」━━ 😢\n\n🌤️ {session} একজন গ্রুপ থেকে চলে গেছেন...\n👤 নাম: {name}\n📌 অবস্থা: {type}\n🕓 সময়: {time}\n\n💬 আমরা সবাই বলছি:\n"তোমায় মিস করবো রে ভাই/বোন!" 😭`
    : threadData.customLeave;

  msg = msg
    .replace(/\{name}/g, userName)
    .replace(/\{type}/g, type)
    .replace(/\{session}/g, session)
    .replace(/\{time}/g, time);

  const gifFolder = join(__dirname, "cache", "leaveGif", "randomgif");
  const gifFiles = existsSync(gifFolder) ? readdirSync(gifFolder) : [];
  const randomGif = gifFiles.length ? join(gifFolder, gifFiles[Math.floor(Math.random() * gifFiles.length)]) : null;

  const formPush = randomGif
    ? { body: msg, attachment: createReadStream(randomGif) }
    : { body: msg };

  return api.sendMessage(formPush, threadID);
};
