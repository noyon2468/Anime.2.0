const fs = require('fs-extra');
const pathFile = __dirname + "/cache/autoseen.txt";

if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, "false");

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput",
  description: "Auto seen on/off",
  commandCategory: "tools",
  usages: "on/off",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api }) => {
  const setting = fs.readFileSync(pathFile, "utf-8");
  if (setting == "true") api.markAsReadAll(() => {});
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  try {
    if (args[0] == "on") {
      fs.writeFileSync(pathFile, "true");
      return api.sendMessage(`${this.config.name} turned on successfully.`, threadID, messageID);
    } else if (args[0] == "off") {
      fs.writeFileSync(pathFile, "false");
      return api.sendMessage(`${this.config.name} turned off successfully.`, threadID, messageID);
    } else {
      return api.sendMessage(
        `Wrong format\nUse: ${global.config.PREFIX}${this.config.name} on/off`,
        threadID,
        messageID
      );
    }
  } catch (err) {
    console.log(err);
  }
};
