const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "groupinfo",
  version: "1.0.2",
  hasPermssion: 1,
  credits: "নূর মোহাম্মদ",
  description: "📊 গ্রুপের সম্পূর্ণ তথ্য জানুন (With group photo)",
  commandCategory: "Box",
  usages: "groupinfo",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const totalMembers = threadInfo.participantIDs.length;
  const adminCount = threadInfo.adminIDs.length;
  const messageCount = threadInfo.messageCount;
  const groupName = threadInfo.threadName || "নাম নেই";
  const emoji = threadInfo.emoji || "❔";
  const groupID = threadInfo.threadID;
  const approvalMode = threadInfo.approvalMode ? "✅ চালু" : "❌ বন্ধ";
  const groupImg = threadInfo.imageSrc;

  let male = 0, female = 0, unknown = 0;

  for (const user of threadInfo.userInfo) {
    if (user.gender === "MALE") male++;
    else if (user.gender === "FEMALE") female++;
    else unknown++;
  }

  const content = 
`🌐 গ্রুপের নাম: ${groupName}
🆔 গ্রুপ আইডি: ${groupID}
👥 মোট সদস্য: ${totalMembers} জন
👑 এডমিন: ${adminCount} জন
👨‍🦱 ছেলে: ${male} জন
👩 মেয়ে: ${female} জন
❔ অজানা লিঙ্গ: ${unknown} জন
💬 মোট মেসেজ: ${messageCount} টি
🎭 ইমোজি: ${emoji}
✅ অনুমোদন মোড: ${approvalMode}

━━━━━━━━━━━━━━━
🤖 বট পরিচালনায়: নূর মোহাম্মদ
🔗 fb.com/nur.mohammad.367314
❤️ Islamic Cyber Bot সেবা`;

  const callback = () => {
    api.sendMessage(
      {
        body: content,
        attachment: fs.createReadStream(__dirname + "/cache/groupinfo.png")
      },
      event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/groupinfo.png"),
      event.messageID
    );
  };

  if (groupImg) {
    request(encodeURI(groupImg))
      .pipe(fs.createWriteStream(__dirname + "/cache/groupinfo.png"))
      .on("close", callback);
  } else {
    api.sendMessage({ body: content }, event.threadID, event.messageID);
  }
};
