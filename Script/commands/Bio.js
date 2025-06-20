module.exports.config = {
  name: "bio",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Bot এর বায়ো পরিবর্তন অথবা রিসেট করুন",
  commandCategory: "admin",
  usages: "bio [নতুন বায়ো] / reset",
  cooldowns: 5
};

const defaultBio = "🤖 বট চালাচ্ছে নূর মোহাম্মদ • ChatGPT সহায়তায়";

module.exports.run = async ({ api, event, args }) => {
  const input = args.join(" ").trim();
  const { threadID, messageID } = event;

  if (!input) return api.sendMessage("⚠️ দয়া করে নতুন বায়ো লিখুন অথবা reset দিন!", threadID, messageID);

  const newBio = input.toLowerCase() === "reset" ? defaultBio : input;

  api.changeBio(newBio, (err) => {
    if (err) return api.sendMessage("❌ বায়ো পরিবর্তনে সমস্যা হয়েছে:\n" + err, threadID, messageID);

    const replyText = input.toLowerCase() === "reset" 
      ? "✅ বায়ো ডিফল্টে রিসেট করা হয়েছে:\n" + defaultBio
      : "✅ বটের নতুন বায়ো সেট করা হয়েছে:\n" + newBio;

    return api.sendMessage(replyText, threadID, messageID);
  });
};
