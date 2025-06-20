module.exports.config = {
  name: "group",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER BOT TEAM | Modified by Nur Muhammad",
  description: "Group management utility",
  commandCategory: "box",
  usages: "[name/emoji/admin/image/info]",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];

  if (args.length === 0) {
    return api.sendMessage(
      `📌 Group Command Usage:
╭──────────────╮
│ 📝 /group name [নতুন নাম]
│ 😀 /group emoji [নতুন ইমোজি]
│ 🖼️ /group image (reply একটি ছবি)
│ 👑 /group admin [@Tag/reply/remove]
│ ℹ️ /group info
╰──────────────╯`,
      event.threadID,
      event.messageID
    );
  }

  // ➤ Group Name Change
  if (args[0] === "name") {
    const newName = args.slice(1).join(" ") || event.messageReply?.body;
    if (!newName) return api.sendMessage("❌ অনুগ্রহ করে একটি নাম দিন।", event.threadID);
    api.setTitle(newName, event.threadID, () =>
      api.sendMessage(`✅ গ্রুপের নাম পরিবর্তন করা হয়েছে:\n${newName}`, event.threadID)
    );
  }

  // ➤ Group Emoji Change
  if (args[0] === "emoji") {
    const emoji = args[1] || event.messageReply?.body;
    if (!emoji) return api.sendMessage("❌ একটি ইমোজি দিন বা রিপ্লাই করুন।", event.threadID);
    api.changeThreadEmoji(emoji, event.threadID, (err) => {
      if (!err) api.sendMessage(`✅ গ্রুপ ইমোজি পরিবর্তন করা হয়েছে: ${emoji}`, event.threadID);
    });
  }

  // ➤ Make Yourself Admin (Only Bot Owner)
  if (args[0] === "me" && args[1] === "admin") {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const isBotAdmin = threadInfo.adminIDs.some(el => el.id === api.getCurrentUserID());
    if (!isBotAdmin) return api.sendMessage("❌ প্রথমে বটকে অ্যাডমিন দিন।", event.threadID);
    if (!global.config.ADMINBOT.includes(event.senderID))
      return api.sendMessage("⚠️ কেবল বট এডমিনরা নিজ
