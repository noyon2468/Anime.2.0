const chalk = require('chalk');
const moment = require('moment-timezone');

module.exports.config = {
  name: "system",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "CYBER BOT TEAM + ChatGPT",
  description: "Displays bot system status with colors and info",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 0
};

const OWNER_UID = "100035389598342"; // Only নূর মোহাম্মদ allowed

module.exports.run = async function({ api, event, Users, Threads }) {
  const { threadID, senderID } = event;

  if (senderID !== OWNER_UID) return;

  const threadInfo = await Threads.getData(threadID);
  const threadName = threadInfo.threadInfo?.threadName || "Unnamed Thread";
  const userName = await Users.getNameUser(senderID);
  const time = moment.tz("Asia/Dhaka").format("LLLL");

  const colors = [
    'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 
    'white', 'gray', 'redBright', 'greenBright', 'yellowBright',
    'blueBright', 'magentaBright', 'cyanBright', 'whiteBright'
  ];

  function randColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  console.log(
    chalk[randColor()](`[📝]→ Group Name: ${threadName}`) + '\n' +
    chalk[randColor()](`[👤]→ Sender Name: ${userName}`) + '\n' +
    chalk[randColor()](`[🆔]→ Sender ID: ${senderID}`) + '\n' +
    chalk[randColor()](`[💬]→ Thread ID: ${threadID}`) + '\n' +
    chalk[randColor()](`[⏰]→ Time: ${time}`) + '\n' +
    chalk[randColor()](`◆━━━━━━━━━◆\n   CYBER BOT SYSTEM\n◆━━━━━━━━━◆`)
  );
};

module.exports.languages = {
  vi: {
    on: "Bật",
    off: "Tắt",
    successText: "Thành công!"
  },
  en: {
    on: "on",
    off: "off",
    successText: "Success!"
  }
};

module.exports.handleEvent = async function({ api, event, Threads, getText }) {
  const { threadID, senderID, messageID } = event;

  // UID Access Restriction
  if (senderID !== OWNER_UID) return;

  let data = (await Threads.getData(threadID)).data || {};
  if (typeof data.system === "undefined" || data.system === false) {
    data.system = true;
  } else {
    data.system = false;
  }

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(
    `${data.system ? getText("on") : getText("off")} ${getText("successText")}`,
    threadID,
    messageID
  );
};
