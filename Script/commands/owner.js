// ====== Admin Info Commands (নূর মোহাম্মদ) ======

const axios = require("axios"); const fs = require("fs-extra"); const request = require("request"); const moment = require("moment-timezone"); const uptime = process.uptime();

function formatUptime(seconds) { const pad = (s) => (s < 10 ? "0" + s : s); const hrs = Math.floor(seconds / 3600); const mins = Math.floor((seconds % 3600) / 60); const secs = Math.floor(seconds % 60); return ${pad(hrs)}:${pad(mins)}:${pad(secs)}; }

const PROFILE_URL = "https://graph.facebook.com/100035389598342/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662"; const PROFILE_LINK = "https://www.facebook.com/nur.mohammad.367314?mibextid=ZbWKwL";

module.exports.config = { name: "info", version: "1.0.0", hasPermssion: 0, credits: "নূর মোহাম্মদ + ChatGPT", description: "Bot owner, uptime, and info", commandCategory: "info", usages: "", cooldowns: 5 };

module.exports.run = async function ({ api, event }) { const { threadID, messageID } = event; const now = moment.tz("Asia/Dhaka").format("D/MM/YYYY hh:mm:ss A"); const imgPath = __dirname + "/cache/owner_nur.png";

if (!fs.existsSync(imgPath)) { await new Promise((resolve) => { request(encodeURI(PROFILE_URL)) .pipe(fs.createWriteStream(imgPath)) .on("close", resolve); }); }

const msg = { body: 🧠 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 𝗔𝗟𝗟 𝗧𝗢𝗢𝗟𝗦\n\n + 👑 𝗢𝘄𝗻𝗲𝗿: নূর মোহাম্মদ\n + 🌍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ঢাকা, গাজীপুর\n + 🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${PROFILE_LINK}\n + 🆔 𝗙𝗕 𝗜𝗗: 100035389598342\n + 🤖 𝗕𝗼𝘁 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: 1.0.0\n + ⚙️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${formatUptime(uptime)}\n + ⏰ 𝗧𝗶𝗺𝗲: ${now}, attachment: fs.createReadStream(imgPath) };

return api.sendMessage(msg, threadID, () => fs.unlinkSync(imgPath), messageID); };

