module.exports.config = {
  name: "offbot",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "CYBER TEAM ⚠️",
  description: "Turn the bot OFF manually",
  commandCategory: "system",
  cooldowns: 0
};

module.exports.run = ({ event, api }) => {
  const permission = ["100035389598342"]; // ✅ Nur Muhammad's UID
  const senderID = event.senderID;

  if (!permission.includes(senderID)) {
    return api.sendMessage("❌ [ERR] এই কমান্ডটি শুধু বট মালিক চালাতে পারবে!", event.threadID, event.messageID);
  }

  const botName = global.config.BOTNAME || "MessengerBot";

  api.sendMessage(
    `🔒 [OFFBOT COMMAND TRIGGERED]
    
⚠️ ${botName} is now shutting down manually by admin: ${senderID}
    
🔌 System process exiting...`,
    event.threadID,
    () => process.exit(0)
  );
};
