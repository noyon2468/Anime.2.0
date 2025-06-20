module.exports.config = {
  name: "wasted",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Wasted effect (GTA style) on user profile picture",
  commandCategory: "fun",
  cooldowns: 2,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { loadImage, createCanvas } = require("canvas");
  const axios = require("axios");
  const fs = require("fs-extra");

  const pathImg = __dirname + "/cache/wasted.png";
  const pathAva = __dirname + "/cache/avt.png";

  let uid;
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = event.senderID;
  }

  // Get user avatar
  const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avatar = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathAva, Buffer.from(avatar, "utf-8"));

  // Get wasted effect image
  const wastedUrl = `https://zenzapis.xyz/photoeditor/wasted?url=https://i.imgur.com/6JY4y7E.png&apikey=7990c7f07144`;
  const wastedOverlay = (await axios.get(wastedUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(wastedOverlay, "utf-8"));

  const baseAva = await loadImage(pathAva);
  const baseOverlay = await loadImage(pathImg);
  const canvas = createCanvas(baseAva.width, baseAva.height);
  const ctx = canvas.getContext("2d");

  // Draw avatar then overlay
  ctx.drawImage(baseAva, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseOverlay, 0, 0, canvas.width, canvas.height);

  const imageBuffer = canvas.toBuffer("image/png");
  fs.writeFileSync(pathImg, imageBuffer);
  fs.unlinkSync(pathAva);

  return api.sendMessage({
    body: `😵 ${await Users.getNameUser(uid)} got *WASTED*!`,
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
