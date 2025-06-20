const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "alert",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Joshua Sy",
  description: "Generate an alert image with your text",
  commandCategory: "image",
  usages: "alert your_text_here",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const text = args.join(" ").replace(/,/g, "  ");
  const path = __dirname + "/cache/alert.png";

  if (!text) {
    return api.sendMessage("⚠️ Please enter text.\n\nExample:\nalert I am watching you!", event.threadID, event.messageID);
  }

  const imageUrl = `https://api.popcat.xyz/alert?text=${encodeURIComponent(text)}`;
  
  // Download the image
  request(imageUrl)
    .pipe(fs.createWriteStream(path))
    .on("close", () => {
      // Send the image
      api.sendMessage(
        {
          body: "",
          attachment: fs.createReadStream(path)
        },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );
    });
};
