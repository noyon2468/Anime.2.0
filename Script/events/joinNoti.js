const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "3.0.1",
  credits: "নূর মোহাম্মদ",
  description: "Stylish welcome with image, audio, time greeting & buttons",
  dependencies: {}
};

module.exports.run = async function({ api, event }) {
  const { threadID, logMessageData, senderID } = event;
  const name = logMessageData.addedParticipants[0].fullName;
  const id = logMessageData.addedParticipants[0].userFbId;

  const hour = new Date().getHours();
  let greeting = "🌅 Good Morning";
  if (hour >= 12 && hour < 17) greeting = "☀️ Good Afternoon";
  else if (hour >= 17 && hour < 21) greeting = "🌇 Good Evening";
  else if (hour >= 21 || hour < 4) greeting = "🌙 Good Night";

  const banners = [
    "https://i.imgur.com/U3ZxKPe.jpeg",
    "https://i.imgur.com/9dJfR9c.jpeg",
    "https://i.imgur.com/z4d4kWb.jpeg"
  ];
  const imageURL = banners[Math.floor(Math.random() * banners.length)];
  const imgPath = __dirname + "/cache/join.jpg";
  const audioURL = "https://files.catbox.moe/uvse9p.mp3";
  const audioPath = __dirname + "/cache/welcome.mp3";

  const imgData = await axios.get(imageURL, { responseType: "stream" });
  imgData.data.pipe(fs.createWriteStream(imgPath));

  const audioData = await axios.get(audioURL, { responseType: "stream" });
  audioData.data.pipe(fs.createWriteStream(audioPath));

  audioData.data.on("end", () => {
    imgData.data.on("end", () => {
      const msg = {
        body: `${greeting}, ${name}!\n\n🌸 আমাদের গ্রুপে আপনাকে স্বাগতম!\nনিচের অপশন থেকে বেছে নিন 👇`,
        attachment: [
          fs.createReadStream(imgPath),
          fs.createReadStream(audioPath)
        ],
        mentions: [{ tag: name, id }]
      };

      api.sendMessage(msg, threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: id,
          type: "menu"
        });
        fs.unlinkSync(imgPath);
        fs.unlinkSync(audioPath);
      });
    });
  });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;

  if (handleReply.type === "menu") {
    if (body.toLowerCase().includes("rules") || body === "1") {
      return api.sendMessage(`📜 Group Rules:\n\n1. No spam\n2. Respect all\n3. No promotion without permission\n4. Stay active 💬`, threadID, messageID);
    }
    if (body.toLowerCase().includes("introduce") || body === "2") {
      return api.sendMessage(`🙋 Introduce Yourself:\n\n• Name:\n• Age:\n• Hobby:\n• From:\n\nLet everyone know you 💬`, threadID, messageID);
    } else {
      return api.sendMessage(`ℹ️ অপশন বুঝতে পারিনি!\nলিখুন: 1 = Rules / 2 = Introduce`, threadID, messageID);
    }
  }
};
