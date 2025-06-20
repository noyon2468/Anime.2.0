const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "wednesday",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "CYBER BOT TEAM + নূর মোহাম্মদ + ChatGPT",
  description: "Responds with Wednesday themed video on keyword match or only on Wednesday",
  commandCategory: "no prefix",
  usages: "wednesday",
  cooldowns: 5
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const input = body.toLowerCase();
  const today = new Date();
  const isWednesday = today.getDay() === 3; // 0 = Sunday, 3 = Wednesday

  const keywords = ["wednesday", "🧛🏻‍♀️", "বুধবার"];
  const triggered = keywords.some(word => input.includes(word));

  // Only trigger if it's Wednesday OR matches keyword
  if (!triggered && !isWednesday) return;

  const filePath = path.join(__dirname, "noprefix", "wednesday.mp4");

  if (!fs.existsSync(filePath)) {
    return api.sendMessage("❌ 'wednesday.mp4' ফাইল খুঁজে পাওয়া যায়নি!", threadID, messageID);
  }

  const greetings = [
    "🔮 Happy Wednesday from নূর মোহাম্মদ!",
    "🧛🏻‍♀️ It's Wednesday my friends!",
    "🖤 Let’s vibe with Wednesday 🧛🏻‍♀️",
    "😈 Time to dance like Wednesday Addams!"
  ];

  const randomMessage = greetings[Math.floor(Math.random() * greetings.length)];

  const msg = {
    body: `${randomMessage}`,
    attachment: fs.createReadStream(filePath)
  };

  api.sendMessage(msg, threadID, messageID);
  api.setMessageReaction("🧛🏻‍♀️", messageID, () => {}, true);
};

module.exports.run = () => {};
