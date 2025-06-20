const fs = require("fs");
const schedule = require("node-schedule");

module.exports.config = {
  name: "tea",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "মজার চা রিয়েকশন + প্রতিদিন ভোরে চা অটো",
  commandCategory: "no prefix",
  usages: "",
  cooldowns: 2
};

// ☕ Funny Tea Reactions
const funnyReplies = {
  "চিনি দিছি": "আরে বাহ! মিষ্টি লাগবো এবার 💖",
  "দুধ থাকবে": "অবশ্যই থাকবে! 🐄 চা জমে যাবে!",
  "লাল চা": "ওহহ, ক্লাসি চা পানকারী আপনি! 🍂",
  "চা": "নাও Bby ☕ চা খাও 💛"
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;
  const text = body.toLowerCase();

  for (let key in funnyReplies) {
    if (text.includes(key)) {
      api.sendMessage(funnyReplies[key], threadID, messageID);
      api.setMessageReaction("🫖", messageID, () => {}, true);
      return;
    }
  }
};

// ☀️ Auto Morning Tea Scheduler
module.exports.onLoad = ({ api }) => {
  schedule.scheduleJob('30 0 * * *', async () => { // ⏰ BD Time 6:30 AM (UTC+6)
    const threads = global.data.allThreadID || [];

    const msg = {
      body: "🌄 শুভ সকাল! নাও চা খাও 🍵\n\n- নূর মোহাম্মদ এর পক্ষ থেকে",
      attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`)
    };

    for (const threadID of threads) {
      api.sendMessage(msg, threadID);
    }
  });
};

// optional run
module.exports.run = () => {};
