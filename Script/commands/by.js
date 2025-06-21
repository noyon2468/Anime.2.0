module.exports.config = {
  name: "by",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Islamick Cyber Chat + Modified by ChatGPT",
  description: "Leave the group or remove someone",
  commandCategory: "Admin",
  usages: "by [mention or ID]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions } = event;

  // If no arguments, remove the command sender from the group
  if (!args[0]) {
    return api.removeUserFromGroup(senderID, threadID);
  }

  let targetID;

  // Check if someone was mentioned
  if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } 
  // If direct ID is provided
  else if (!isNaN(args[0])) {
    targetID = args[0];
  } 
  else {
    return api.sendMessage("⚠️ অনুগ্রহ করে সঠিকভাবে @mention করুন বা ইউজার আইডি দিন।", threadID, messageID);
  }

  // Prevent bot from removing itself
  if (targetID === api.getCurrentUserID()) {
    return api.sendMessage("❌ আমি নিজেকে রিমুভ করতে পারবো না!", threadID, messageID);
  }

  // Try removing the user
  api.removeUserFromGroup(targetID, threadID, (err) => {
    if (err) {
      return api.sendMessage("❌ ইউজারকে রিমুভ করা সম্ভব হয়নি। আমি হয়তো অ্যাডমিন নই।", threadID, messageID);
    } else {
      return api.sendMessage("✅ ইউজারকে গ্রুপ থেকে রিমুভ করা হয়েছে!", threadID);
    }
  });
};
