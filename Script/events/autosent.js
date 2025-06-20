module.exports.config = {
  name: "autosend",
  version: "1.0.0",
  credits: "নূর মোহাম্মদ",
  description: "নির্দিষ্ট সময় সকল গ্রুপে অটো মেসেজ পাঠায়"
};

module.exports.onLoad = async function ({ api }) {
  const moment = require("moment-timezone");
  const sendTime = "17:22:00"; // HH:mm:ss format
  const messageToSend = "⏰ অটো মেসেজ! সবাই সচেতন থাকো! ✅";

  setInterval(async () => {
    const now = moment.tz("Asia/Dhaka").format("HH:mm:ss");
    if (now === sendTime) {
      const allThread = global.data.allThreadID || [];
      const failedThreads = [];

      for (const threadID of allThread) {
        if (isNaN(parseInt(threadID))) continue;
        try {
          await api.sendMessage(messageToSend, threadID);
        } catch (err) {
          failedThreads.push(threadID);
        }
      }

      // Notify Admins if any fail
      if (failedThreads.length > 0) {
        for (const adminID of global.config.ADMINBOT) {
          api.sendMessage(
            `❌ কিছু থ্রেডে মেসেজ পাঠানো যায়নি:\n${failedThreads.join("\n")}`,
            adminID
          );
        }
      }
    }
  }, 1000); // Check every second
};
