module.exports.config = {
  name: "banner",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "Generate stylish anime banner",
  commandCategory: "game",
  usages: "{number}|{name1}|{name2}|{name3}|{color}",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { createCanvas, loadImage, registerFont } = require("canvas");
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const textInput = args.join(" ").trim().replace(/\s*\|\s*/g, "|").split("|");
  const text1 = textInput[0] || "21";
  const text2 = textInput[1] || "Name1";
  const text3 = textInput[2] || "Name2";
  const text4 = textInput[3] || "Name3";
  const inputColor = textInput[4] || "";

  const fontDir = __dirname + "/tad";
  const imgPath = fontDir + "/avatar_1.png";
  const avaPath = fontDir + "/avatar_2.png";

  // Ensure /tad/ exists
  if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir);

  // Fonts download if not exist
  const fonts = [
    {
      file: "PastiOblique-7B0wK.otf",
      url: "https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf"
    },
    {
      file: "gantellinesignature-bw11b.ttf",
      url: "https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf"
    },
    {
      file: "UTM Bebas.ttf",
      url: "https://github.com/hanakuUwU/font/blob/main/UTM%20Bebas.ttf?raw=true"
    }
  ];

  for (const font of fonts) {
    const fontPath = path.join(fontDir, font.file);
    if (!fs.existsSync(fontPath)) {
      const fontData = (await axios.get(font.url, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(fontPath, Buffer.from(fontData, "utf-8"));
    }
  }

  // Load data from character list
  const characterList = (await axios.get("https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864")).data;
  const charData = characterList[text1 - 1];
  if (!charData) return api.sendMessage("❌ ভুল নম্বর নির্বাচন করা হয়েছে!", event.threadID, event.messageID);

  const avatarData = (await axios.get(charData.imgAnime, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(avaPath, Buffer.from(avatarData, "utf-8"));

  const bgData = (await axios.get("https://imgur.com/Ch778s2.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(imgPath, Buffer.from(bgData, "utf-8"));

  const canvas = createCanvas(3000, 1000);
  const ctx = canvas.getContext("2d");

  const background = await loadImage(imgPath);
  const avatar = await loadImage(avaPath);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(avatar, 1500, -400, 1980, 1980);

  // Fonts registration
  registerFont(path.join(fontDir, "PastiOblique-7B0wK.otf"), { family: "Oblique" });
  registerFont(path.join(fontDir, "gantellinesignature-bw11b.ttf"), { family: "Signature" });
  registerFont(path.join(fontDir, "UTM Bebas.ttf"), { family: "Bebas" });

  // Texts
  ctx.fillStyle = inputColor.toLowerCase() === "no" || inputColor === "" ? charData.colorBg : inputColor;

  ctx.textAlign = "start";
  ctx.font = "370px Oblique";
  ctx.fillText(text2, 500, 750);

  ctx.fillStyle = "#fff";
  ctx.font = "350px Signature";
  ctx.fillText(text3, 500, 680);

  ctx.textAlign = "end";
  ctx.fillStyle = "#f56236";
  ctx.font = "145px Oblique";
  ctx.fillText(text4, 2100, 870);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(imgPath, imageBuffer);

  return api.sendMessage(
    {
      body: "✅ তোমার ব্যানার রেডি!",
      attachment: fs.createReadStream(imgPath)
    },
    event.threadID,
    () => {
      fs.unlinkSync(imgPath);
      fs.unlinkSync(avaPath);
    },
    event.messageID
  );
};
