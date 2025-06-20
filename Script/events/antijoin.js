module.exports.config = {
  name: "antijoin",
  eventType: ["log:subscribe"],
  version: "1.1.0",
  credits: "নূর মোহাম্মদ",
  description: "গ্রুপে নতুন কেউ এলে Auto Remove করে দেয় যদি Anti-Join মোড চালু থাকে"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const { threadID, logMessageData } = event;
  const threadData = await Threads.getData(threadID);
  const data = threadData.data || {};

  if (data.newMember !== true) return;

  // যদি কেউ একাধিক ইউজার অ্যাড করে
  const addedUsers = logMessageData.addedParticipants;

  for (const user of addedUsers) {
    const userID = user.userFbId;

    // যদি বট নিজে যোগ হয়, তাহলে স্কিপ
    if (userID == api.getCurrentUserID()) continue;

    try {
      await new Promise(res => setTimeout(res, 1000));
      await api.removeUserFromGroup(userID, threadID);

      const userName = await Users.getNameUser(userID);
      console.log(`🔴 Removed ${userName} (${userID}) due to Anti Join mode.`);
    } catch (err) {
      console.error(`❌ ইউজার রিমুভ করতে সমস্যা হয়েছে: ${userID}`, err);
    }
  }

  return api.sendMessage(
    `🚫 গ্রুপে Anti-Join মোড চালু আছে!\n\n❗ নতুন মেম্বার অ্যাড করলে অটো রিমুভ হয়ে যাবে।\n🛠️ দয়া করে আগে এটি বন্ধ করুন: /setbox newMember off`,
    threadID
  );
};
