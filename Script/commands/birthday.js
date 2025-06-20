const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "bday",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Nur Muhammad + ChatGPT",
  description: "কাউকে মেনশন করলে তার জন্মদিন জানায়",
  usePrefix: false,
  commandCategory: "fun",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const mention = Object.keys(event.mentions)[0];
  const dataPath = __dirname + "/bdayData.json";

  if (!mention) {
    return api.sendMessage("❌ অনুগ্রহ করে কারো নাম ট্যাগ করে দিন। যেমন:\n`@নূর মোহাম্মদ`", event.threadID, event.messageID);
  }

  let userID = mention;
  let data = {};

  // Check if data file exists
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath));
  }

  // Check if user's birthday is saved
  if (!data[userID]) {
    return api.sendMessage("⚠️ ট্যাগ করা ইউজারের জন্মদিন ডাটাবেজে খুঁজে পাওয়া যায়নি।\nদয়া করে এডমিনকে বলো সেট করে দিতে।", event.threadID, event.messageID);
  }

  const birthDateStr = data[userID]; // Example: "2007-05-04"
  const birth = new Date(birthDateStr);
  const now = new Date();

  // Set birthday for current year or next
  let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (now > nextBirthday) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  const t = nextBirthday - now;
  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));

  // Image fetch
  const imgPath = __dirname + `/cache/bday_${userID}.png`;
  const avatarURL = `https://graph.facebook.com/${userID}/picture?width=720&height=720`;

  const name = event.mentions[mention].split(" ")[0] || "ব্যবহারকারী";

  const msg = `🎉 ${name} এর জন্মদিনে বাকি:\n📅 ${days} দিন\n🕐 ${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড\n\n🎂 তার জন্ম তারিখ: ${birth.toLocaleDateString("bn-BD")}`;

  const callback = () => {
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );
  };

  return request(encodeURI(avatarURL))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => callback());
};
