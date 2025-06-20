const moment = require("moment-timezone");

module.exports.config = {
  name: "autoban",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "Detects and auto-bans users who try to use the bot as another bot or spam",
  commandCategory: "ADMINBOT",
  cooldowns: 0
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, messageID, body, senderID } = event;
  const time = require("moment-timezone").tz("Asia/Dhaka").format("HH:mm:ss | DD-MM-YYYY");

  // যদি senderID bot-এর owner হয়, তাহলে skip করো
  if (senderID == api.getCurrentUserID()) return;

  let name = await Users.getNameUser(senderID);
  const warningMsg = `${name},\n\n⚠️ তুমি এমন একটি কমান্ড ব্যবহার করেছো যা শুধুমাত্র মূল বটের জন্য।\nএটি স্প্যামিং/অন্য বট হিসাবে গণ্য হয়েছে এবং তোমাকে ব্লক/ব্যান করা হচ্ছে!\n\n🕒 সময়: ${time}\n\n📌 দয়া করে এই ধরনের কার্যকলাপ থেকে বিরত থাকো!`;

  const blacklistTriggers = [
    "otherbots", "ban otherbots", "avoid spam", "auto bot", "bot detected",
    "command not found", "preset is missing", "auto banned", "another bot"
  ];

  for (let trigger of blacklistTriggers) {
    if (body?.toLowerCase().includes(trigger)) {
      // ব্যান সিস্টেমে যুক্ত করা
      const userData = Users.getData(senderID)?.data || {};
      userData.banned = true;
      userData.reason = trigger;
      userData.dateAdded = time;
      global.data.userBanned.set(senderID, {
        reason: trigger,
        dateAdded: time
      });

      await Users.setData(senderID, { data: userData });

      api.sendMessage({ body: warningMsg }, threadID, () => {
        // Broadcast to all threads about the ban
        for (const tid of global.data.allThreadID) {
          api.sendMessage(
            `📢 সতর্কতা!\n\n❌ ${name} (${senderID}) কে বট ইউজার হিসেবে শনাক্ত করা হয়েছে এবং ব্যান করা হয়েছে!\n\n👉 কারণ: ${trigger}`,
            tid
          );
        }
      }, messageID);
      break;
    }
  }
};

// Command call এর সময় help/info দেয়
module.exports.run = async ({ event, api }) => {
  return api.sendMessage(
    `📌 এই কমান্ডটি নিজে নিজে চলার জন্য তৈরি, যাতে অন্য বট ইউজারদের অটো ব্যান করা যায়।`,
    event.threadID
  );
};
