const chalk = require('chalk');
const moment = require('moment-timezone');

module.exports.config = {
  name: "system",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "CYBER BOT TEAM + ChatGPT",
  description: "Displays bot system status with colors and toggles system mode.",
  commandCategory: "Admin",
  usages: "[use command to print info, send 'system' to toggle]",
  cooldowns: 3
};

const OWNER_UID = "100035389598342"; // Nur Mohammad only

module.exports.run = async function({ api, event, Users, Threads }) {
  const { threadID, senderID } = event;

  if (senderID !== OWNER_UID)
    return api.sendMessage("⛔️ এই কমান্ডটি কেবল নূর মোহাম্মদের জন্য অনুমোদিত!", threadID);

  const threadInfo = await Threads.getData(threadID);
  const threadName = threadInfo.threadInfo?.threadName || "Unnamed Thread";
  const userName = await Users.getNameUser(senderID);
  const time = moment.tz("Asia/Dhaka").format("LLLL");

  const colors = [
    'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 
    'white', 'gray', 'redBright', 'greenBright', 'yellowBright',
    'blueBright', 'magentaBright', 'cyanBright', 'whiteBright'
  ];

  const randColor = () => colors[Math.floor(Math.random() * colors.length)];

  console.log(
    chalk[randColor()](`◆━━━━━━━━━━━━━◆`) + '\n' +
    chalk[randColor()](`[📝] Group Name: ${threadName}`) + '\n' +
    chalk[randColor()](`[👤] Sender Name: ${userName}`) + '\n' +
    chalk[randColor()](`[🆔] Sender ID: ${senderID}`) + '\n' +
    chalk[randColor()](`[💬] Thread ID: ${threadID}`) + '\n' +
    chalk[randColor()](`[⏰] Time: ${time}`) + '\n' +
    chalk[randColor()](`🤖 CYBER BOT SYSTEM LOGGED`) + '\n' +
    chalk[randColor()](`◆━━━━━━━━━━━━━◆`)
  );

  return api.sendMessage(`✅ সিস্টেম লগ কনসোলে প্রিন্ট হয়েছে নূর মোহাম্মদ ভাই!`, threadID);
};

module.exports.languages = {
  vi: {
    on: "Bật",
    off: "Tắt",
    successText: "Thành công!"
  },
  en: {
    on: "✅ System mode is now ON",
    off: "❌ System mode is now OFF",
    successText: "Status updated!"
  }
};

module.exports.handleEvent = async function({ api, event, Threads, getText }) {
  const { threadID, senderID, messageID, body } = event;

  if (senderID !== OWNER_UID) return;

  const content = body?.toLowerCase()?.trim();
  const triggerWords = ["system", "toggle", "!sys", "/system", "সিস্টেম"];

  if (!triggerWords.includes(content)) return;

  let data = (await Threads.getData(threadID)).data || {};
  data.system = !data.system;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(
    `${data.system ? getText("on") : getText("off")}`,
    threadID,
    messageID
  );
};
