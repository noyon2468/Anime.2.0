const axios = require("axios");

module.exports.config = {
  name: "adduser",
  version: "2.5",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Add user to group using profile link or ID",
  commandCategory: "group",
  usages: "[fb_uid or profile_link]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const send = (msg) => api.sendMessage(msg, threadID, messageID);
  const input = args[0];

  if (!input) return send("👤 ইউজার আইডি বা প্রোফাইল লিংক দিন।");

  const info = await api.getThreadInfo(threadID);
  const isBotAdmin = info.adminIDs.some(e => e.id == api.getCurrentUserID());
  const isApprovalMode = info.approvalMode;
  const members = info.participantIDs.map(id => parseInt(id));

  let uid, name;

  if (isNaN(input)) {
    // Profile link
    try {
      let res = await axios.get(`https://id.traodoisub.com/api.php?link=${encodeURIComponent(input)}`);
      if (!res.data || !res.data.id) return send("😞 প্রোফাইল লিংক থেকে আইডি খুঁজে পাওয়া যায়নি।");
      uid = res.data.id;
      name = res.data.name || "Facebook User";
    } catch (err) {
      return send("❌ আইডি বের করতে সমস্যা হয়েছে। লিংকটা চেক করুন।");
    }
  } else {
    // Direct numeric ID
    uid = input;
    name = "User";
  }

  if (members.includes(parseInt(uid))) return send(`✅ ${name} ইতিমধ্যেই গ্রুপে আছে!`);

  try {
    await api.addUserToGroup(uid, threadID);
    if (isApprovalMode && !isBotAdmin)
      return send(`🔒 ${name} কে যুক্ত করা হয়েছে। এখন তাকে অ্যাডমিনের অনুমোদনের প্রয়োজন হবে।`);
    else return send(`✅ ${name} কে সফলভাবে গ্রুপে যুক্ত করা হয়েছে!`);
  } catch (e) {
    return send(`❌ ${name} কে গ্রুপে অ্যাড করা যায়নি।`);
  }
};
