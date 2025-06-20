module.exports.config = { name: "adden", version: "1.0.0", hasPermssion: 0, credits: "নূর মোহাম্মদ + ChatGPT + CYBER BOT TEAM", description: "এডিটেড ছবি তে ২টি টেক্সট বসাও", commandCategory: "Edit-IMG", usages: "[text1] | [text2]", cooldowns: 5, };

module.exports.wrapText = (ctx, text, maxWidth) => { return new Promise((resolve) => { if (ctx.measureText(text).width < maxWidth) return resolve([text]); if (ctx.measureText("W").width > maxWidth) return resolve(null); const words = text.split(" "); const lines = []; let line = ""; while (words.length > 0) { let split = false; while (ctx.measureText(words[0]).width >= maxWidth) { const temp = words[0]; words[0] = temp.slice(0, -1); if (split) words[1] = ${temp.slice(-1)}${words[1]}; else { split = true; words.splice(1, 0, temp.slice(-1)); } } if (ctx.measureText(${line}${words[0]}).width < maxWidth) line += ${words.shift()} ; else { lines.push(line.trim()); line = ""; } if (words.length === 0) lines.push(line.trim()); } return resolve(lines); }); };

module.exports.run = async function ({ api, event, args }) { const { loadImage, createCanvas, registerFont } = require("canvas"); const fs = global.nodemodule["fs-extra"]; const axios = global.nodemodule["axios"]; const pathImg = __dirname + /cache/anhdaden.png; const pathFont = __dirname + /cache/SVN-Arial.ttf;

let textInput = args.join(" ").split("|"); if (textInput.length < 2) return api.sendMessage("⚠️ ২টি টেক্সট দিন: [text1] | [text2]", event.threadID, event.messageID); const [text1, text2] = textInput.map(e => e.trim());

if (!fs.existsSync(pathFont)) { const fontData = (await axios.get("https://github.com/SkidderOFC/font/raw/main/SVN-Arial.ttf", { responseType: "arraybuffer" })).data; fs.writeFileSync(pathFont, Buffer.from(fontData, "utf-8")); }

const bgData = (await axios.get("https://i.imgur.com/2ggq8wM.png", { responseType: "arraybuffer" })).data; fs.writeFileSync(pathImg, Buffer.from(bgData, "utf-8"));

const baseImage = await loadImage(pathImg); const canvas = createCanvas(baseImage.width, baseImage.height); const ctx = canvas.getContext("2d");

registerFont(pathFont, { family: "ArialCustom" }); ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height); ctx.font = "30px ArialCustom"; ctx.fillStyle = "#000077"; ctx.textAlign = "center";

const line1 = await this.wrapText(ctx, text1, 420); const line2 = await this.wrapText(ctx, text2, 420);

ctx.fillText(line1.join("\n"), 170, 130); ctx.fillText(line2.join("\n"), 170, 440);

const imageBuffer = canvas.toBuffer(); fs.writeFileSync(pathImg, imageBuffer); return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID); };

