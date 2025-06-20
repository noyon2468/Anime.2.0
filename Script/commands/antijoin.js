module.exports.config = {
  name: "antijoin",
  version: "2.0.0",
  credits: "নূর মোহাম্মদ",
  hasPermssion: 1,
  description: "নতুন সদস্যদের যোগদান বন্ধ/চালু করুন (Owner only)",
  usages: "antijoin on/off",
  commandCategory: "group",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
  const threadID = event.threadID;
  const messageID = event.messageID;

  // ✅ শুধু নির্দিষ্ট UID চালাতে পারবে
  const ownerUID = "100035389598342";
  if (event.senderID !== ownerUID) {
    return api.sendMessage(
      "❌ এই কমান্ডটি কেবলমাত্র নূর মোহাম্মদ চালাতে পারেন!",
      threadID, messageID
    );
  }

  // বট অ্যাডমিন কিনা চেক
  const info = await api.getThreadInfo(threadID);
  if (!info.adminIDs.some(admin => admin.id == api.getCurrentUserID())) {
    return api.sendMessage(
      "⚠️ অনুগ্রহ করে বটকে গ্রুপ অ্যাডমিন করুন, তারপর চেষ্টা করুন।",
      threadID, messageID
    );
  }

  const threadData = (await Threads.getData(threadID)).data || {};
  threadData.newMember = !threadData.newMember;

  await Threads.setData(threadID, { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  return api.sendMessage(
    `🛡️ Anti-Join সিস্টেম ${threadData.newMember ? "✅ চালু" : "❌ বন্ধ"} করা হলো!`,
    threadID, messageID
  );
};
