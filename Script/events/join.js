module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "নূর মোহাম্মদ",
  description: "নতুন সদস্য গ্রুপে যোগ দিলে স্বাগত জানায়"
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const name = event.logMessageData.addedParticipants[0].fullName;
  const message = `👋 স্বাগতম, ${name}!\nআমাদের গ্রুপে আপনাকে পেয়ে আনন্দিত!`;
  return api.sendMessage(message, threadID);
};
