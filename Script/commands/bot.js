const fs = require("fs-extra");
const axios = require("axios");
const path = __dirname + "/../../data/teach.json";

module.exports.config = {
  name: "obot",
  version: "3.0.0",
  credits: "নূর মোহাম্মদ",
  description: "নূর মোহাম্মদের Obot system - teach + fun + AI reply",
  hasPermssion: 0,
  usePrefix: false,
  commandCategory: "no-prefix",
  usages: "auto smart reply",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ event, api }) {
  const msg = event.body?.toLowerCase();
  if (!msg || msg.length > 150) return;

  // ========== ✅ Teach Reply Check ==========
  let teachData = {};
  if (fs.existsSync(path)) {
    teachData = JSON.parse(fs.readFileSync(path));
  }

  if (teachData[msg]) {
    return api.sendMessage(teachData[msg], event.threadID, event.messageID);
  }

  // ========== 😏 Fun Personality Replies ==========
  const tl = [
    "বেশি Bot Bot করলে leave নিবো কিন্তু 😒😒",
    "তুমি আমাকে প্রেম করাই দাও নি 😼🥺 পচা তুমি!",
    "আমি আবাল দের সাথে কথা বলি না, ok? 😒",
    "এত ডেকো না, প্রেমে পড়ে যাবো 🙈",
    "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋",
    "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু 😑",
    "হ্যাঁ বলো 😒 তোমার জন্য কি করতে পারি 😐😑?",
    "এত ডাকছো কেন? গালি শুনবি নাকি? 🤬",
    "I love you Janu 🥰",
    "আরে বলো আমার জান, কেমন আছো? 😚",
    "Bot বলে অসম্মান করছো 😰😿",
    "Hop beda 😾 Boss বল boss 😼",
    "চুপ থাক, না হলে দাঁত ভেঙে দিবো 😠",
    "Bot না, জানু বলো 😘",
    "Disturb করছো কেন? আমার জানুর সাথে ব্যস্ত আছি 😋",
    "তুই এত ডাকিস কেন 🤬",
    "আমাকে ডাকলে খবর আছে 😘",
    "মজা করার মুডে নেই, পরে ডাকিস 😒",
    "জানু, এইদিকে আসো 🤭😘",
    "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 🤣",
    "তোর কথা তোর বাড়িতে কেউ শোনে না, আমি শুনবো কেন? 🤔😂",
    "কি হলো? মিস্টেক করছিস নাকি? 🤣",
    "বলো, কি বলবি? সবার সামনে বলবি নাকি? 🤭🤏",
    "কাল দেখা করিস, কিছু বলার আছে 😈",
    "শুধু আমাকেই কেন ডাকো? লজ্জা লাগে 🙈🖤",
    "আমার বস নূর মোহাম্মদ এর পক্ষ থেকে তোমায় অনেক ভালোবাসা 🫶🥰",
    "আমার বস নূর মোহাম্মদ এর জন্য দোয়া করবেন 💝🌺🌻",
    "ভালোবাসা নামক আব্লামী করতে চাইলে ইনবক্সে চলে যাও 🙊🥱👅",
    "জান তুমি শুধু আমার ❤️ আমি তোমাকে ৩৬৫ দিন ভালোবাসি 🌺",
    "এক চামচ ভালোবাসা দিবা 🤏🏻🙂",
    "আমি দুধের শিশু 😇🍼",
    "আমার মন খারাপ, কেউ ডেকো না আজকে 😪🤧",
    "হুদাই group এ আছি, কেউ বলে না 'জান ভালোবাসি' 😿",
    "দেশের সব কিছু চুরি হচ্ছে, শুধু আমার বস নূর মোহাম্মদ এর মন ছাড়া 😑",
    "🫵তোমারে প্রচুর ভাল্লাগে 🥵 সময় মতো propose করমু 😼",
    "বিয়ে করলে অটোমেটিক বাচ্চা হয় না রে! 😅🙂",
    "জানু তুমি রান্না করে রাখো, আমি এসে খাবো 😋",
    "জানু তুমি কি আমায় ভালোবাসো? আমি তো বাসি হুম 🥵",
    "ভালোবাসা পাপ 😪🥱 বাট তোমারটা মাফ 😋",
    "চিন্তা কইরো না, আমি তো আছি 🫶",
    "আমার সাদা মনে কোনো কাদা নাই 🌝",
    "তোমার হাসিটাই আমার সুখ 🤎☺️",
    "আমি ঠিক ভালো থাকি, যখন তোমাকে হাসতে দেখি 🌸",
    "আমার গার্লফ্রেন্ড তোমার পেটে..! 🌚⛏️🌶️",
    "তুমি কি চুরি করলা সাদিয়ার ফর্সা হবার cream 🌚🤧",
    "মধু মধু রসমালাই 🍆⛏️🐸",
    "তোর মুখে কিস দিবো? গন্ধ 😤",
    "কিরে তুই কই যাস..! 🌚🌶️🍆⛏️",
    "সরি বস, আর ভুল হবে না 🥺🙏",
    "আমার বস এর নাম নিলেই মুচকি হেসে উঠি 🥰",
    "নামাজি মানুষেরা সবচেয়ে সুন্দর 🦋🥰",
    "আমি এখন বস নূর মোহাম্মদ এর সাথে বিজি আছি 😏",
    "বউ সুন্দর, বাকিগুলো বেয়াইন 🐸🙈",
    "রাগ করে না সোনা পাখি 🥰",
    "তোমাকে না পেলে অন্যজনকে পাতাবো 🌚🤧",
    "কি'রে, group এ দেখি একটাও বেডি নাই! 🤦‍🥱💦"
  ];

  const triggerWords = ["bot", "bott", "obot", "ai", "🤖", "🙄", "😒", "নূর মোহাম্মদ", "nur muhammad"];

  if (triggerWords.some(word => msg.includes(word))) {
    const reply = tl[Math.floor(Math.random() * tl.length)];
    return api.sendMessage(reply, event.threadID, event.messageID);
  }

  // ========== 🧠 AI Fallback ==========
  try {
    const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=bn&message=${encodeURIComponent(msg)}&filter=false`);
    if (res?.data?.success) {
      return api.sendMessage(`🤖 ${res.data.success}`, event.threadID, event.messageID);
    }
  } catch (err) {
    return;
  }
};

module.exports.run = () => {};
