const axios = require("axios");
const moment = require("moment-timezone");

const PEXELS_API_KEY = "ZSZ8UpQP1CivOKGbDTclBGZZdskzxXmd1pXrFOV92h5c9sWYEZmHbWC7"; // ← এখানে তোমার API KEY বসাও
const PEXELS_URL = "https://api.pexels.com/v1/search";

// 🔠 বাংলা ক্যাপশন লিস্ট (চাইলেই আরো বাড়াতে পারো)
const captions = [
  "ভালো থেকো, কারণ তোমার হাসি অনেকের ভালো রাখে! 🖤",
  "এক কাপ চা আর একটু শান্তি — জীবন মানে আর কিছু না। ☕",
  "তুমি থাকলে প্রতিদিনটা স্পেশ্যাল হয়। 🤍",
  "নীরবতা কোনোদিন অর্থহীন নয়, কিছুটা বিশ্বাস করো। 😌",
  "কষ্টের মাঝে হেঁটে যাও – একদিন এ পথ সুগন্ধ ছড়াবে। 🥀",
  "হয়তো ভুলে গেছো, কিন্তু কিছু কথা মন ভুলে না! 😢",
  "শূন্যতা কখনো শূন্য থাকে না, ভরে ওঠে স্মৃতিতে। 💭",
  "যারা অভিমান করে, তারাই বেশি ভালোবাসে। 🫶",
  "ছোট ছোট ভালোবাসা দিয়েই তৈরি হয় গভীর সম্পর্ক! ❤️",
  "আজকের দিনটা নিজেকে ভালোবাসো... কারণ তুমিও স্পেশাল। 🌸"
];

module.exports.config = {
  name: "caption",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "Bangla caption সহ নেট থেকে ইমেজ আনে",
  commandCategory: "caption",
  usages: "caption",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body || !body.toLowerCase().startsWith("caption")) return;

  const name = await Users.getNameUser(senderID);
  const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");

  try {
    // ১. Pexels থেকে ছবি আনো
    const res = await axios.get(PEXELS_URL, {
      headers: { Authorization: PEXELS_API_KEY },
      params: { query: "bangla quote", per_page: 10 }
    });

    const photos = res.data.photos;
    if (!photos || photos.length === 0) throw new Error("ছবি পাওয়া যায়নি!");

    const photo = photos[Math.floor(Math.random() * photos.length)];
    const imgUrl = photo.src.medium;

    // ২. বাংলা ক্যাপশন র‍্যান্ডম
    const caption = captions[Math.floor(Math.random() * captions.length)];

    // ৩. ইমেজ ডাউনলোড করে পাঠাও
    const imgStream = (await axios.get(imgUrl, { responseType: "stream" })).data;

    return api.sendMessage({
      body: `🖤 ${name},\n\n${caption}\n\n🕰️ ${time}`,
      attachment: imgStream
    }, threadID, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage({
      body: `❌ দুঃখিত, ক্যাপশন পাঠাতে সমস্যা হয়েছে!\n\nবিস্তারিত: ${err.message}`
    }, threadID, messageID);
  }
};

module.exports.run = function() {};
