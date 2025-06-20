module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "1.1.0",
  credits: "নূর মোহাম্মদ",
  description: "কেউ নিজের ইচ্ছায় লিভ নিলে আবার এড করে দেয়"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  const { threadID, logMessageData, author } = event;
  const leftUID = logMessageData.leftParticipantFbId;
  const botID = api.getCurrentUserID();

  // নিজেই যদি লিভ হয় (বট), স্কিপ করো
  if (leftUID == botID) return;

  const threadData = await Threads.getData(threadID);
  const settings = threadData.data || {};
  if (settings.antiout !== true) return;

  const userName = global.data.userName.get(leftUID) || await Users.getNameUser(leftUID);

  const isSelfLeave = leftUID == author;

  if (isSelfLeave) {
    // আবার এড করো
    api.addUserToGroup(leftUID, threadID, (err) => {
      if (err) {
        return api.sendMessage(
          `❌ ${userName} কে আবার এড করা গেলো না!\nসম্ভবত উনি বটকে ব্লক করেছে বা তার প্রোফাইলে মেসেজ অন না 😞`,
          threadID
        );
      }

      return api.sendMessage(
        `😼 শোন শালায়!\n${userName}, তুই অনুমতি ছাড়া গ্রুপ ছাড়সোস?\n\n🛑 এখানে যাইতে হলে নূর মোহাম্মদের অনুমতি লাগে!\nতোরে আবার mafia style-এ এড দিয়া দিলাম! 😈`,
        threadID
      );
    });
  }
};
