module.exports.config = {
  name: "logout",
  version: "1.0.1",
  hasPermssion: 2, // শুধু বট এডমিন (permission level 2) ব্যবহার করতে পারবে
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Logout the bot from Facebook",
  commandCategory: "System",
  usages: "",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;

  // সেফটি চেক - শুধুমাত্র নির্দিষ্ট UID ব্যবহার করতে পারবে (ঐচ্ছিক, চাইলে এড করো)
  const allowedAdmins = ["100035389598342"]; // Nur Muhammad এর UID

  if (!allowedAdmins.includes(senderID)) {
    return api.sendMessage("⚠️ শুধুমাত্র নূর মোহাম্মদ বটকে লগআউট করতে পারবে!", threadID, messageID);
  }

  // লগআউট নোটিফিকেশন
  api.sendMessage("✅ বট এখন লগআউট হচ্ছে... দেখা হবে আবার! 👋", threadID, async () => {
    // একটু দেরি দিয়ে logout যাতে মেসেজ পাঠাতে পারে
    setTimeout(() => {
      api.logout();
    }, 1000);
  });
};
