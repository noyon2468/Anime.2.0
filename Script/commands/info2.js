const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const moment = require("moment-timezone");

module.exports.config = {
  name: "info2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "বট এবং অ্যাডমিন সম্পর্কিত তথ্য দেখায়",
  commandCategory: "info",
  cooldowns: 1,
  dependencies: {
    request: "",
    "fs-extra": "",
    axios: ""
  }
};

module.exports.run = async function({ api, event }) {
  const botPrefix = global.config.PREFIX;
  const botName = global.config.BOTNAME;
  const uptime = process.uptime();

  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const currentTime = moment.tz("Asia/Dhaka").format("hh:mm:ss A");

  const randomImages = [
    "https://i.imgur.com/WXQIgMz.jpeg",
    "https://i.imgur.com/ybM9Wtr.jpeg",
    "https://i.postimg.cc/QdgH08j6/Messenger-creation.gif"
  ];

  const selectedImage = randomImages[Math.floor(Math.random() * randomImages.length)];

  const message = `
🌺𝐁𝐎𝐓 𝐈𝐍𝐅𝐎🌺

💠 বটের নাম: ${botName}
💠 প্রিফিক্স: ${botPrefix}
💠 আপটাইম: ${hours}h ${minutes}m ${seconds}s
💠 টাইম এখন: ${currentTime}

🌼𝐀𝐃𝐌𝐈𝐍 𝐈𝐍𝐅𝐎🌼

👤 নাম: নূর মোহাম্মদ
📍 অবস্থান: ঢাকা, গাজীপুর
🔗 প্রোফাইল: https://www.facebook.com/profile.php?id=100035389598342

💖 ধন্যবাদ বট ব্যবহার করার জন্য!
`;

  const imagePath = __dirname + "/cache/info2.jpg";
  const callback = () => {
    api.sendMessage(
      {
        body: message,
        attachment: fs.createReadStream(imagePath)
      },
      event.threadID,
      () => fs.unlinkSync(imagePath)
    );
  };

  request(encodeURI(selectedImage))
    .pipe(fs.createWriteStream(imagePath))
    .on("close", callback);
};
