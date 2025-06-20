module.exports.config = {
  name: "automention",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "CYBER BOT ⚠️ + Modified by নূর মোহাম্মদ",
  description: "যাকে ট্যাগ করা হয়েছে, তাকে আবার রিপ্লাই ট্যাগ করা হবে",
  commandCategory: "other",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, mentions, senderID } = event;

  if (Object.keys(mentions).length === 0) {
    return api.sendMessage(`📌 তুমি কাউকে ট্যাগ করোনি!\n\n👉 @[${senderID}:0] একা একা খেলো না!`, threadID, messageID);
  } else {
    for (let uid in mentions) {
      const name = mentions[uid].replace('@', '');
      api.sendMessage(`🔔 ${name} আপনি ট্যাগ হয়েছেন!\n👉 @[${uid}:0]`, threadID);
    }
  }
};
