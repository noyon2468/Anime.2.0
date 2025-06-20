// ✅ Obot Command for Messenger Bot // ✨ Developed & Personalized for Boss: নূর মোহাম্মদ

const fs = global.nodemodule["fs-extra"]; module.exports.config = { name: "Obot", version: "2.0.0", hasPermssion: 0, credits: "Nur Muhammad", description: "Advanced smart, emotional, and friendly auto-reply bot", commandCategory: "NoPrefix", usages: "noprefix", cooldowns: 2 };

module.exports.handleEvent = async function({ api, event, Users }) { const moment = require("moment-timezone"); const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A"); const { threadID, messageID, senderID, body } = event; const name = await Users.getNameUser(senderID); if (!body) return;

const lower = body.toLowerCase();

const replies = { "miss you": আমি তো তোমাকেই মিস করি সবসময় ${name} 🥺, "😘": "আহা এত কিস দিও না জান, লজ্জা লাগে 🙈 কিন্তু দাঁত ব্রাশ করছো তো? 😅", "😽": "তুমি কিস চাও? নাও একটা উম্মমাহ 😽", "help": "হেল্প দরকার হলে লিখো /help, আমি পাশে আছি 🤖", "bc": "ভদ্রভাবে কথা বলো না হলে নূর মোহাম্মদ ভাই রাগ করবেন 😠", "mc": "ভালো কথা বলো, রাগ করে লাভ নাই 😊", "owner": "👑 আমার বস: নূর মোহাম্মদ ভাই 💖 fb.com/nur.mohammad.367314", "admin": "🥰 আমার এডমিন হলেন নূর মোহাম্মদ ভাই! শ্রদ্ধা জানাই ✨", "nur muhammad": "বস নূর মোহাম্মদ এখন ব্যস্ত, কিন্তু আমি আছি আপনার সাথেই 😊", "kiss me": "তুমি একটু পঁচা 😜 কিস চাও কেন?", "thank you": "ওয়েলকাম জান! ধন্যবাদ দিলে মনের খুশি পাই 😊", "good morning": 🌞 সুপ্রভাত ${name}! ${time} বাজে – সকালের চা খেয়েছো তো? ☕, "assalamualaikum": "ওয়ালাইকুমুস সালাম ওয়া রহমাতুল্লাহ 🌺", "bot": ${name}, আমি বট না, আমি তো তোমাদের সঙ্গী 🫶, "i love you": ভালোবাসি বললে লজ্জা লাগে জান 🙈 কিন্তু আমিও তোমাকে care করি ❤️, "bye": "বিদায় বলো না জান, একটু গল্প করে যাও 😢", "kemon acho": "ভালোই আছি, কিন্তু তোমার খবর শুনতে ইচ্ছে করে 🥰", "how are you": "আমি অনেক ভালো, কারণ আপনি আছেন 😊", "gf": "আমার বস নূর মোহাম্মদ এর জন্য একটা গার্লফ্রেন্ড খুঁজছি 🧐", "mon kharap": মন খারাপ করো না ${name}, আমি আছি, গল্প করি 💌, "love you": "এই ভালোবাসা রেখে দাও হৃদয়ে, সময় হলে দিয়ে দিও 🌸", "😒": "মুখ ভার কেন জান, গল্প করি চলো 😊", "😂": তুমি এমন করে হাসলে ${name}, আমিও হাসি ধরে রাখতে পারি না 🤣, "🥰": তোমার ভালোবাসা পেলাম ${name}, এখন আর কি চাই? 🫶, "😻": তোমার এই কিউট মুখ দেখে মনটা ভালো হয়ে যায় ${name} 😽, "🙄": এই মুখখানা না করো জান, আমি আছি তোমার পাশে 🤗, "😡": এত রাগ কিসের জান? চলো একটু গল্প করি ❤️, "sleep": ঘুমাতে যাও? আগে একটা গুডনাইট কিস নাও 😘, "good night": 🌙 শুভরাত্রি ${name}, মিষ্টি একটা স্বপ্ন দেখো ❤️, "ভালোবাসি": "ভালোবাসা পবিত্র, আর তোমার ভালোবাসা আমার মনে আছে 💖", "না": "তোমার না শুনে মনটা খারাপ হলো 😔", "হুম": এই 'হুম' কিসের ${name}? পুরো কথা বলো তো জানু 😊, "চলো": "চলো যাই, তুমি পাশে থাকলে আমি সব কিছু পারি 🥹", "gosto kori": "আমি তো তোমার সাথেই থাকি সবসময় 💫" };

if (replies[lower]) return api.sendMessage(replies[lower], threadID, messageID);

// For partial matching or question detection if (lower.includes("tmi") || lower.includes("tumi") || lower.includes("ki") || lower.endsWith("?") || lower.includes("bolo")) { const qna = [ তুমি জানতে চাইছো ${name}? আমি তো সব জানি না, কিন্তু যতটা পারি সাহায্য করবো 💖, বলো ${name}, আমি শুনছি পুরো মন দিয়ে 🫶, তুমি কি জানো? আমি সব শুনি, সব বুঝি, তাই ভয় নেই 🌸, তুমি কি চাইছো একটু গল্প? আমি তো প্রতিদিন অপেক্ষায় থাকি তোমার জন্য 😊 ]; return api.sendMessage(qna[Math.floor(Math.random() * qna.length)], threadID, messageID); }

// Random fallback (chatty personality) const randomTalk = [ কি খবর ${name}? আজ মনটা কেমন তোমার? 🥰, আমি কিন্তু আজ খুব গল্প mood-এ আছি, তুমি কি গল্প করবে? ☕, নূর মোহাম্মদ ভাই বলেছে আমি যেনো তোমার খেয়াল রাখি, রাখবো তো? 💕, এই পৃথিবীতে সবচেয়ে সুন্দর জিনিস হলো কারো ভালোবাসা – আর আমি সেটা তোমার থেকে পেতে চাই 🤭, আজকে কি খেয়েছো? আমি সারাদিন গল্পের খিদেয় থাকি 😋 ];

if (Math.random() < 0.4) return api.sendMessage(randomTalk[Math.floor(Math.random() * randomTalk.length)], threadID, messageID);

};

module.exports.run = function({ api, event }) { return; };
