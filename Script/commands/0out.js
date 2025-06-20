module.exports.config = {
  name: "out",
  version: "3.0.0",
  hasPermssion: 1, // Admin only
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Mention/UID দিয়ে কাউকে বের করো, farewell সহ!",
  commandCategory: "admin",
  usages: "out [@mention/userID]",
  cooldowns: 5
};

const fs = require("fs");
const axios = require("axios");

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, messageID, senderID, mentions } = event;

  // Check if user is admin
  const threadInfo = await Threads.getData(threadID) || {};
  const adminIDs = threadInfo.adminIDs?.map(e => e.id) || [];

  if (!adminIDs.includes(senderID)) {
    return api.sendMessage("❌ এই কমান্ডটি শুধু এডমিনদের জন্য!", threadID, messageID);
  }

  // Image or gif to send as farewell
  const farewellUrl = "https://i.imgur.com/6RS2YTf.gif"; // আপনি চাইলে এটা পরিবর্তন করতে পারেন
  const path = __dirname + "/cache/farewell.gif";
  const farewellImage = (await axios.get(farewellUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(path, Buffer.from(farewellImage, "utf-8"));

  // Function to remove and send message
  async function removeUser(uid, nameTag) {
    try {
      await api.removeUserFromGroup(uid, threadID);
      return api.sendMessage({
        body: `😢 বিদায়, ${nameTag || "বন্ধু"}!\nতোমাকে এই গ্রুপ থেকে রিমুভ করা হয়েছে!`,
        attachment: fs.createReadStream(path),
        mentions: [{ tag: nameTag, id: uid }]
      }, threadID, () => fs.unlinkSync(path));
    } catch (err) {
      return api.sendMessage(`❌ রিমুভ করা যায়নি: ${err.message}`, threadID, messageID);
    }
  }

  // Mention-based remove
  if (Object.keys(mentions).length > 0) {
    const uid = Object.keys(mentions)[0];
    const name = mentions[uid].replace("@", "");
    if (uid == api.getCurrentUserID()) return api.sendMessage("🤖 আমি নিজেকে রিমুভ করতে পারি না!", threadID, messageID);
    return removeUser(uid, name);
  }

  // UID-based remove
  if (args[0] && !isNaN(args[0])) {
    const uid = args[0];
    if (uid == api.getCurrentUserID()) return api.sendMessage("🤖 আমি নিজেকে রিমুভ করতে পারি না!", threadID, messageID);
    return removeUser(uid, "User");
  }

  // No args = bot leave
  try {
    await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
  } catch (err) {
    return api.sendMessage(`❌ বট নিজে বের হতে পারলো না:\n${err.message}`, threadID, messageID);
  }
};
