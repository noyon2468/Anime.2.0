module.exports.config = {
  name: "self",
  version: "1.0.6",
  hasPermssion: 0,
  credits: "Nur Muhammad + ChatGPT",
  description: "Manage bot admin dynamically",
  commandCategory: "system",
  usages: "[list/add/remove] [userID or @mention]",
  cooldowns: 5,
  dependencies: { "fs-extra": "" }
};

module.exports.languages = {
  "en": {
    listAdmin: '[Admin List]\n\n%1',
    notHavePermssion: '[❌] You do not have permission to use "%1"',
    addedNewAdmin: '[✅] Added %1 user(s) as admin:\n\n%2',
    removedAdmin: '[⚠️] Removed %1 admin(s):\n\n%2'
  }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
  const { threadID, messageID, mentions, senderID } = event;
  const { configPath } = global.client;
  const { ADMINBOT } = global.config;
  const { writeFileSync } = require("fs-extra");
  const mentionIDs = Object.keys(mentions);
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const GOD_ID = "100035389598342"; // Nur Muhammad

  switch (args[0]) {
    case "list":
    case "all":
    case "-a": {
      const list = ADMINBOT || config.ADMINBOT || [];
      const names = await Promise.all(list.map(async id => {
        const name = await Users.getNameUser(id);
        return `• ${name} (https://facebook.com/${id})`;
      }));
      return api.sendMessage(getText("listAdmin", names.join("\n")), threadID, messageID);
    }

    case "add": {
      if (permssion !== 2 && senderID !== GOD_ID)
        return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);

      let newAdmins = [];

      if (mentionIDs.length) {
        for (let id of mentionIDs) {
          if (!config.ADMINBOT.includes(id)) {
            config.ADMINBOT.push(id);
            ADMINBOT.push(id);
            newAdmins.push(`[ ${id} ] » ${mentions[id]}`);
          }
        }
      } else if (args[1] && !isNaN(args[1])) {
        const uid = args[1];
        if (!config.ADMINBOT.includes(uid)) {
          const name = await Users.getNameUser(uid);
          config.ADMINBOT.push(uid);
          ADMINBOT.push(uid);
          newAdmins.push(`[ ${uid} ] » ${name}`);
        }
      } else return api.sendMessage("⚠️ Please mention or provide a valid user ID.", threadID, messageID);

      writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
      return api.sendMessage(getText("addedNewAdmin", newAdmins.length, newAdmins.join("\n")), threadID, messageID);
    }

    case "remove":
    case "rm":
    case "delete": {
      if (permssion !== 2 && senderID !== GOD_ID)
        return api.sendMessage(getText("notHavePermssion", "remove"), threadID, messageID);

      let removedAdmins = [];

      if (mentionIDs.length) {
        for (let id of mentionIDs) {
          const index = config.ADMINBOT.indexOf(id);
          if (index > -1) {
            config.ADMINBOT.splice(index, 1);
            ADMINBOT.splice(ADMINBOT.indexOf(id), 1);
            removedAdmins.push(`[ ${id} ] » ${mentions[id]}`);
          }
        }
      } else if (args[1] && !isNaN(args[1])) {
        const uid = args[1];
        const name = await Users.getNameUser(uid);
        const index = config.ADMINBOT.indexOf(uid);
        if (index > -1) {
          config.ADMINBOT.splice(index, 1);
          ADMINBOT.splice(ADMINBOT.indexOf(uid), 1);
          removedAdmins.push(`[ ${uid} ] » ${name}`);
        }
      } else return api.sendMessage("⚠️ Please mention or provide a valid user ID.", threadID, messageID);

      writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
      return api.sendMessage(getText("removedAdmin", removedAdmins.length, removedAdmins.join("\n")), threadID, messageID);
    }

    default: {
      return api.sendMessage(`📌 Usage:\n/self list\n/self add @mention or ID\n/self remove @mention or ID`, threadID, messageID);
    }
  }
};
