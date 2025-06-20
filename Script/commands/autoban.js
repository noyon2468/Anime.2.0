const moment = require("moment-timezone");

module.exports.config = {
  name: "fixspam-chui",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "uibot + ChatGPT",
  description: "Bot গালি দিলে auto-ban ও auto-unban হয়",
  commandCategory: "noprefix",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, messageID, body, senderID } = event;
  if (senderID === api.getCurrentUserID()) return;

  const ADMINBOT = global.config.ADMINBOT || [];
  if (ADMINBOT.includes(senderID)) return; // admin ignore

  const username = await Users.getNameUser(senderID);
  const now = moment().tz("Asia/Dhaka");
  const nowFormatted = now.format("HH:mm:ss DD/MM/YYYY");
  const expireAt = now.add(12, "hours").valueOf(); // 12 ঘন্টা পরে আনব্যান

  const badWords = [
    "bot mc", "mc bot", "chutiya bot", "bsdk bot", "bot teri maa ki chut", "jhatu bot",
    "ভোদার বট", "stupid bots", "চাপড়ি বট", "bot lund", "mc নূর মোহাম্মদ", "bsdk নূর মোহাম্মদ",
    "fuck bots", "নূর মোহাম্মদ চুদিয়া", "নূর মোহাম্মদ গান্ডু", "useless bot", "বট চুদি",
    "crazy bots", "bc bot", "nikal bsdk bot", "bot khùng", "হেড়ার বট", "bot paylac rồi",
    "con bot lòn", "cmm bot", "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó",
    "cc bot", "bot tiki", "lozz bottt", "lol bot", "loz bot", "lồn bot", "boder bot",
    "bot lon", "bot cac", "bot nhu lon", "bot xodi", "bot sudi", "bot sida", "bot fake",
    "bot code", "bot shoppee", "bad bots", "bot cau"
  ];

  for (const word of badWords) {
    if (!body) return;
    const msg = body.toLowerCase();

    if (msg === word.toLowerCase()) {
      const userData = await Users.getData(senderID);
      const data = userData.data || {};

      data.banned = 1;
      data.reason = word;
      data.dateAdded = nowFormatted;
      data.unbanTime = expireAt;

      await Users.setData(senderID, { data });
      global.data.userBanned.set(senderID, {
        reason: word,
        dateAdded: nowFormatted,
        unbanTime: expireAt
      });

      // Message in group
      api.sendMessage(
        `» Notice from Owner নূর মোহাম্মদ «\n\n${username}, you are banned for using offensive words to the bot.\n⛔ Auto-unban after 12 hours.`,
        threadID
      );

      // Notify Admins
      for (const adminID of ADMINBOT) {
        api.sendMessage(
          `=== Bot Notification ===\n\n🆘 গালিদাতা: ${username}\n🔰 UID: ${senderID}\n😡 গালি: ${word}\n⏰ সময়: ${nowFormatted}\n\n⚠️ ১২ ঘণ্টার জন্য ব্যান করা হয়েছে।`,
          adminID
        );
      }
      break;
    }
  }
};

// ✅ Auto-unban checker (check every command run)
module.exports.run = async ({ event, api, Users }) => {
  const { senderID, threadID } = event;

  const userData = await Users.getData(senderID);
  const data = userData.data || {};

  if (data.banned && data.unbanTime && Date.now() >= data.unbanTime) {
    data.banned = 0;
    delete data.reason;
    delete data.dateAdded;
    delete data.unbanTime;

    await Users.setData(senderID, { data });
    global.data.userBanned.delete(senderID);

    return api.sendMessage(
      `✅ Your ban has been lifted automatically after 12 hours. Please behave better next time.`,
      threadID
    );
  }

  return api.sendMessage(
    `(\\_/) \n( •_•) \n// >🧠 Give me your brain and put it in your head.\n\nDo you know this is a noprefix command?`,
    threadID
  );
};
