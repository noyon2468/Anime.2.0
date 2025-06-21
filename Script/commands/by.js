module.exports.config = {
  name: "by",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ x ChatGPT",
  description: "Leave the group or remove someone, but only by নূর মোহাম্মদ",
  commandCategory: "Admin",
  usages: "/by [mention or ID]",
  cooldowns: 5
};

const OWNER_UID = "100035389598342"; // ✅ শুধুমাত্র নূর মোহাম্মদ

module.exports.run = async function ({ api, event, args, mentions }) {
  const { senderID, threadID, messageID } = event;

  if (senderID !== OWNER_UID) {
    return api.sendMessage(
      `✨ শুধুমাত্র নূর মোহাম্মদ এই কমান্ড ব্যবহার করতে পারবেন!\n😼 তুমি তো প্রজা! এই রাজকীয় ক্ষমতা তোমার নেই 🐸`,
      threadID, messageID
    );
  }

  let targetID;

  if (!args[0]) {
    // কোনো ইউজার mention বা ID না দিলে নিজেকেই বের করবে
    return api.removeUserFromGroup(senderID, threadID);
  }

  if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (!isNaN(args[0])) {
    targetID = args[0];
  } else {
    return api.sendMessage("⚠️ দয়া করে সঠিক @mention বা ইউজার আইডি দিন!", threadID, messageID);
  }

  if (targetID === api.getCurrentUserID()) {
    return api.sendMessage("❌ আমি নিজেকে রিমুভ করতে পারি না!", threadID, messageID);
  }

  api.removeUserFromGroup(targetID, threadID, (err) => {
    if (err) {
      return api.sendMessage("❌ ইউজার রিমুভ করা গেল না! সম্ভবত আমি গ্রুপ অ্যাডমিন না।", threadID, messageID);
    } else {
      return api.sendMessage("✅ ইউজারকে গ্রুপ থেকে সুন্দরভাবে বিদায় জানানো হলো!", threadID);
    }
  });
};
