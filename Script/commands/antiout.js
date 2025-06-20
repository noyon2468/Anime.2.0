module.exports.config = {
  name: "antiout",
  version: "2.0.0",
  credits: "নূর মোহাম্মদ",
  hasPermssion: 1,
  description: "কেউ নিজে থেকে লিভ দিলে তাকে আবার গ্রুপে আনা হবে (Owner only)",
  usages: "antiout on/off",
  commandCategory: "group",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
  const threadID = event.threadID;
  const messageID = event.messageID;

  // ✅ শুধুমাত্র নির্দিষ্ট UID চালাতে পারবে
  const ownerUID = "100035389598342";
  if (event.senderID !== ownerUID) {
    return api.sendMessage(
      "❌ এই কমান্ডটি কেবলমাত্র নূর মোহাম্মদ চালাতে পারেন!",
      threadID, messageID
    );
  }

  // থ্রেড ডেটা লোড করা
  const threadData = (await Threads.getData(threadID)).data || {};

  // antiout toggle
  threadData.antiout = !threadData.antiout;

  await Threads.setData(threadID, { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  return api.sendMessage(
    `🔒 Anti-Out সিস্টেম সফলভাবে ${threadData.antiout ? "✅ চালু" : "❌ বন্ধ"} করা হলো!`,
    threadID, messageID
  );
};
