module.exports.config = { name: "war", version: "3.0.0", hasPermssion: 0, credits: "নূর মোহাম্মদ ", description: "Funny roast war against tagged user with control", commandCategory: "fun", usages: "@mention", cooldowns: 10 };

const activeWars = new Set();

module.exports.run = async function ({ api, event, args }) { const mention = Object.keys(event.mentions)[0]; if (!mention) return api.sendMessage("😎 কারে roast করবো? ট্যাগ তো কর ভাই!", event.threadID);

const threadID = event.threadID; const name = event.mentions[mention]; if (activeWars.has(threadID)) return api.sendMessage("⚠️ এখনই একটা roast চলছে! আগে ওটা শেষ হোক।", threadID);

activeWars.add(threadID);

const roasts = [ 😂 ${name}, তোর বুদ্ধি দেখে তো Google-ও আত্মহত্যা করে!, 🤣 ${name}, তুই এত বোকারামি করিস, পাসওয়ার্ড দিলেও \"1234\"!, 😆 ${name}, তোর মুখ দেখে TikTok-ও বলছে \"Filter not found\"!, 🤓 ${name}, তোর হাসি এত বাজে, Joker-ও রিটায়ার করতেছে!, 🐷 ${name}, তোকে roast করলেই খুশি পাই!, 🧠 ${name}, তোর IQ দিয়ে কেউ বাল্ব জ্বালাতে পারবে না!, 💩 ${name}, তুই Joke না ভাই, পুরো বাথরুম ফেইল!, 🪳 ${name}, তোকে দেখলে Cockroach-এরও দুঃখ লাগে!, 🧨 ${name}, তুই এমন একটা বিস্ফোরক, যেটা শুধু নিজের জীবন নষ্ট করে!, 🎤 ${name}, তুই গান গাইলে ভলকানো ফেটে যায়!, 🤖 ${name}, তুই AI না ভাই, পুরা BUG SYSTEM!, ✨ ${name}, এই ছিলো তোর জন্য আজকের স্পেশাল roast night!, 😎 আবার আসিস roast খাইতে, নূর মোহাম্মদ অনলাইন থাকলেই হবে! ];

for (let i = 0; i < roasts.length; i++) { setTimeout(() => { if (!activeWars.has(threadID)) return; api.sendMessage({ body: roasts[i], mentions: [{ id: mention }] }, threadID); if (i === roasts.length - 1) activeWars.delete(threadID); }, i * 3000); } };

module.exports.handleEvent = function ({ api, event }) { const { body, threadID } = event; if (!body) return;

const lower = body.toLowerCase(); if (lower.startsWith("/stopwar")) { if (activeWars.has(threadID)) { activeWars.delete(threadID); return api.sendMessage("🛑 Roast বন্ধ করে দেয়া হয়েছে!", threadID); } else { return api.sendMessage("❌ এই চ্যাটে তো কোনো roast চলছেই না!", threadID); } } };

