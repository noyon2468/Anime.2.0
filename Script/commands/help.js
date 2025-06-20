const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "help",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "সকল কমান্ড লিস্ট ও ব্যবহার দেখায়",
  commandCategory: "system",
  usages: "[নাম | পেজ | all]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": `╭──────•◈•──────╮
│        𝗜𝘀𝗹𝗮𝗺𝗶𝗰𝗸 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁
│● নাম: •—» %1 «—•
│● ব্যবহার: %3
│● বিবরণ: %2
│● ক্যাটেগরি: %4
│● অপেক্ষা সময়: %5 সেকেন্ড
│● অনুমতি: %6
│মডিউল কোড বাই:
│•—» নূর মোহাম্মদ «—•
╰──────•◈•──────╯`,
    "helpList": '[ মোট %1টি কমান্ড আছে, "%2help নাম" দিয়ে ব্যবহার দেখুন ]',
    "user": "ইউজার",
    "adminGroup": "গ্রুপ এডমিন",
    "adminBot": "বট এডমিন"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined") return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (body.trim().toLowerCase() == "help") {
    return global.client.commands.get("help").run({ api, event, args: ["all"], getText });
  }

  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const command = commands.get(splitBody[1].toLowerCase());

  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      ((command.config.hasPermssion == 0) ? getText("user") :
        (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ),
    threadID, messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  // ✅ help all
  if (args[0] == "all") {
    const group = [];
    let msg = "";

    for (const commandConfig of commands.values()) {
      const cat = commandConfig.config.commandCategory.toLowerCase();
      if (!group.some(item => item.group == cat)) {
        group.push({ group: cat, cmds: [commandConfig.config.name] });
      } else {
        group.find(item => item.group == cat).cmds.push(commandConfig.config.name);
      }
    }

    group.forEach(commandGroup => {
      msg += `❄️ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)}\n${commandGroup.cmds.join(' • ')}\n\n`;
    });

    const imageUrl = "https://i.imgur.com/HPaSlBu.jpeg";
    const imagePath = __dirname + `/cache/help_all.jpg`;

    request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
      api.sendMessage({
        body: `✿🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃✿\n\n` + msg +
          `✿══════════════✿\n` +
          `│𝗨𝘀𝗲: ${prefix}help [name]\n│𝗨𝘀𝗲: ${prefix}help [page]\n│𝗢𝘄𝗻𝗲𝗿: নূর মোহাম্মদ\n│𝗧𝗼𝘁𝗮𝗹: ${commands.size}\n`,
        attachment: fs.createReadStream(imagePath)
      }, threadID, (err, info) => {
        fs.unlinkSync(imagePath);
        if (!autoUnsend) return;
        setTimeout(() => api.unsendMessage(info.messageID), delayUnsend * 1000);
      }, messageID);
    });
    return;
  }

  // ✅ help page
  if (!command) {
    const allCmds = Array.from(commands.keys()).sort();
    const page = parseInt(args[0]) || 1;
    const pageSize = 15;
    const totalPage = Math.ceil(allCmds.length / pageSize);
    const start = (page - 1) * pageSize;
    const list = allCmds.slice(start, start + pageSize).map(cmd => `•—»[ ${cmd} ]«—•`).join('\n');

    const header = `╭──────•◈•──────╮\n│        𝗜𝘀𝗹𝗮𝗺𝗶𝗰𝗸 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁\n│ 🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃 \n╰──────•◈•──────╯`;
    const footer = `\n\n╭────•✿•────╮\n│ Total: ${allCmds.length} | Page: ${page}/${totalPage} \n│ Use: ${prefix}help [name/page] \n│ Owner: নূর মোহাম্মদ\n╰────•✿•────╯`;

    const imageUrl = "https://i.imgur.com/WXQIgMz.jpeg";
    const imagePath = __dirname + `/cache/help_page.jpg`;

    request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
      api.sendMessage({
        body: `${header}\n\n${list}${footer}`,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => fs.unlinkSync(imagePath), messageID);
    });

    return;
  }

  // ✅ help [command name]
  const infoText = getText("moduleInfo",
    command.config.name,
    command.config.description,
    `${(command.config.usages) ? command.config.usages : ""}`,
    command.config.commandCategory,
    command.config.cooldowns,
    ((command.config.hasPermssion == 0) ? getText("user") :
      (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
    command.config.credits
  );

  const imageUrl = "https://i.imgur.com/QdgH08j6.gif";
  const imagePath = __dirname + "/cache/help_info.gif";

  request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
    api.sendMessage({ body: infoText, attachment: fs.createReadStream(imagePath) },
      threadID, () => fs.unlinkSync(imagePath), messageID);
  });
};
