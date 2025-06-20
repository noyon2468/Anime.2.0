// banner3.js (বাংলা ও Obot Style)

const axios = require("axios"); const fs = require("fs-extra"); const request = require("request");

module.exports.config = { name: "banner3", version: "1.0.0", hasPermssion: 0, credits: "নূর মোহাম্মদ + ChatGPT", description: "স্টাইলিশ এনিমে ব্যানার জেনারেট করুন", commandCategory: "image-edit", usages: "banner3", cooldowns: 5 };

module.exports.run = async function({ api, args, event }) { const linkList = [ "https://imgur.com/7AiLKO5.png", "https://imgur.com/6we7T1g.png", "https://imgur.com/W1TNnj9.png", "https://imgur.com/qZAh20x.png" ]; const images = await Promise.all(linkList.map(async (url) => { const res = await axios.get(url, { responseType: "stream" }); return res.data; }));

return api.sendMessage({ body: 🎨 নিচের ব্যানার স্টাইলগুলো থেকে একটি বেছে নিন\n🔢 নাম্বার রিপ্লাই করুন, attachment: images }, event.threadID, (err, info) => { global.client.handleReply.push({ step: 1, name: "banner3", author: event.senderID, messageID: info.messageID }); }); };

module.exports.handleReply = async function({ api, event, handleReply }) { if (handleReply.author !== event.senderID) return; const step = handleReply.step;

if (step === 1) { if (isNaN(event.body)) return api.sendMessage("⛔️ সংখ্যা দিন ভাই...", event.threadID); return api.sendMessage(✅ আপনি স্টাইল ${event.body} সিলেক্ট করেছেন!\n🧙 এবার এনিমে চরিত্র আইডি দিন (রিপ্লাই করুন), event.threadID, (err, info) => { global.client.handleReply.push({ step: 2, name: "banner3", author: event.senderID, style: event.body, messageID: info.messageID }); }); }

if (step === 2) { return api.sendMessage(🧑‍🎨 আপনি চরিত্র আইডি: ${event.body} দিয়েছেন\nএবার মেইন নাম দিন (রিপ্লাই করুন), event.threadID, (err, info) => { global.client.handleReply.push({ step: 3, name: "banner3", author: event.senderID, style: handleReply.style, charID: event.body, messageID: info.messageID }); }); }

if (step === 3) { return api.sendMessage(📛 মেইন নাম: ${event.body}\nএবার সাবনাম দিন (রিপ্লাই করুন), event.threadID, (err, info) => { global.client.handleReply.push({ step: 4, name: "banner3", author: event.senderID, style: handleReply.style, charID: handleReply.charID, mainName: event.body, messageID: info.messageID }); }); }

if (step === 4) { return api.sendMessage(📛 সাবনাম: ${event.body}\n🎨 ব্যাকগ্রাউন্ড কালার দিন (না চাইলে "no" লিখুন), event.threadID, (err, info) => { global.client.handleReply.push({ step: 5, name: "banner3", author: event.senderID, style: handleReply.style, charID: handleReply.charID, mainName: handleReply.mainName, subName: event.body, messageID: info.messageID }); }); }

if (step === 5) { const { style, charID, mainName, subName } = handleReply; const color = (event.body.toLowerCase() === "no") ? "#ffffff" : event.body; return api.sendMessage(✅ ব্যানার তৈরি হচ্ছে...\n🖼️ মেইন: ${mainName}\n🧩 সাবনাম: ${subName}\n🎨 কালার: ${color}, event.threadID, async () => { // এখানে তুমি image edit লজিক বসাবে, উপরের কোড থেকেই reuse করতে পারো // শেষে image path দিয়ে return api.sendMessage({ body: ✅ ব্যানার রেডি! ✨\n📸 তৈরিতে সহায়তা: Obot 👤 Owner: নূর মোহাম্মদ, attachment: fs.createReadStream("path/to/final-banner.png") }, event.threadID); }); } };

  
