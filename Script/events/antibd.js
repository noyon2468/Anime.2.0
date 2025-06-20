module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "1.0.0",
  credits: "নূর মোহাম্মদ",
  description: "বটের নিকনেম কেউ চেঞ্জ করলে আগের নামে ফিরিয়ে দেয় ও ওয়ার্নিং দেয়"
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const { logMessageData, threadID, author } = event;
  const botID = api.getCurrentUserID();
  const { BOTNAME = "hinata hyuga", ADMINBOT = [] } = global.config;

  // যদি কেউ বটের নিকনেম চেঞ্জ করে, এবং সে এডমিন না
  if (
    logMessageData.participant_id == botID &&
    author != botID &&
    !ADMINBOT.includes(author)
  ) {
    // আগের nickname বের করো
    const threadData = await Threads.getData(threadID);
    const expectedNickname = threadData?.data?.nickname || BOTNAME;

    // যদি নতুন nickname আগেরটার চেয়ে আলাদা হয়
    if (logMessageData.nickname !== expectedNickname) {
      // নিকনেম ফিরিয়ে দাও
      await api.changeNickname(expectedNickname, threadID, botID);

      // নাম বের করো যিনি চেঞ্জ করেছেন
      const info = await Users.getData(author);
      const name = info.name || "User";

      // মেসেজ পাঠাও
      return api.sendMessage({
        body: `😾 ওহো ${name}!\nতুই বটের নাম চেঞ্জ করতে গেছিস? আহারে পিচ্চি...\n\n🛡 এই বটের মালিক শুধু "নূর মোহাম্মদ" ভাই! উনিই চেঞ্জ করতে পারবেন।\n\n🔒 নিকনেম রিসেট করে দিলাম! 😼`,
      }, threadID);
    }
  }
};
