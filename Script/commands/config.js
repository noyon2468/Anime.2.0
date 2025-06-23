module.exports.config = { name: "config", version: "1.0.0", hasPermssion: 2, credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", description: "config bot!", commandCategory: "admin", cooldowns: 5 };

module.exports.languages = { "vi": {}, "en": {} };

const appState = require("../../appstate.json"); const cookie = appState.map(item => item = item.key + "=" + item.value).join(";"); const headers = { "Host": "mbasic.facebook.com", "user-agent": "Mozilla/5.0 (Linux; Android 11; M2101K7BG Build/RP1A.200720.011;) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36", "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9", "sec-fetch-site": "same-origin","sec-fetch-mode": "navigate", "sec-fetch-user": "?1", "sec-fetch-dest": "document", "referer": "https://mbasic.facebook.com/?refsrc=deprecated&_rdr", "accept-encoding": "gzip, deflate", "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7", "Cookie": cookie };

module.exports.handleReply = async function({ api, event, handleReply }) { if (event.senderID !== "100035389598342") return api.sendMessage("\u274c \u09a6\u09c1\u0983\u0996\u09bf\u09a4, \u0986\u09aa\u09a8\u09bf \u098f\u0987 \u0995\u09ae\u09be\u09a8\u09cd\u09a1 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u09c7\u09b0 \u0985\u09a8\u09c1\u09ae\u09a4\u09bf \u09aa\u09be\u09a8\u09a8\u09bf!", event.threadID, event.messageID);

const botID = api.getCurrentUserID(); const axios = require("axios");

// Your full config logic here // Keep the rest of your existing code unchanged // Example: type === 'menu', changeBio, changeAvatar, etc. };
