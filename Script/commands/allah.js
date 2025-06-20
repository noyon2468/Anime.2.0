const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');

module.exports.config = {
  name: "islamgif",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER Chat",
  description: "Send random Islamic text GIF",
  commandCategory: "image",
  usages: "islamgif",
  cooldowns: 5,
  dependencies: {
    request: "",
    "fs-extra": "",
    axios: ""
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  const gifUrls = [
    "https://i.imgur.com/oV4VMvm.gif",
    "https://i.imgur.com/7zLmJch.gif",
    "https://i.imgur.com/DHoZ9A1.gif",
    "https://i.imgur.com/LvUF38x.gif",
    "https://i.imgur.com/r0ZE7lx.gif",
    "https://i.imgur.com/98PjVxg.gif",
    "https://i.imgur.com/2eewmJm.gif",
    "https://i.imgur.com/C2a3Cj3.gif",
    "https://i.imgur.com/U07Yd3U.gif",
    "https://i.imgur.com/ScGCmKE.gif"
  ];

  const gifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
  const filePath = __dirname + "/cache/islamic.gif";

  const messageBody =
    "─✿\n\n" +
    "•┄┅═❁🌺❁════┅┄•\n" +
    "•—»✨ [ 𝗔𝗹𝗹𝗮𝗵𝗮𝗵 𝗚𝗜𝗙 ] ✨\n" +
    "•┄┅═❁🌺❁════┅┄•\n\n" +
    "✿┼─আল্লাহু আকবর┼✿\n" +
    "•\n";

  request(encodeURI(gifUrl))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);
    });
};
