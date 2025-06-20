module.exports.config = {
  name: "restart",
  version: "1.0.1",
  hasPermssion: 0, // সকলের জন্য এক্সেস দেওয়া, কিন্তু ভিতরে UID চেক হবে
  credits: "Nur Muhammad + ChatGPT",
  description: "Restart the bot (Nur Muhammad only)",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;
  const ownerID = "100035389598342"; // Nur Muhammad

  if (senderID != ownerID) {
    return api.sendMessage(
      `________________\n"restart"\n________________\n\n✨ শুধুমাত্র নূর মোহাম্মদ এই কমান্ড ব্যবহার করতে পারবেন।\n✨ তুই তো কেবল প্রজা! তুই এই কমান্ড ব্যবহার করতে পারবি না 🙂🐸`,
      threadID,
      messageID
    );
  }

  api.sendMessage(`🔁 ${global.config.BOTNAME || "Bot"} এখন রিস্টার্ট হচ্ছে...`, threadID, () => {
    process.exit(1); // Bot restart
  });
};
