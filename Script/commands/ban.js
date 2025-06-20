const fs = require("fs-extra");

module.exports.config = {
  name: "ban",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ ",
  description: "সদস্যকে ওয়ার্ন দিয়ে গ্রুপ থেকে ব্যান করো",
  commandCategory: "group",
  usages: "[tag]/[reply]/view/unban/listban/reset",
  cooldowns: 5
};

module.exports.run = async function({ api, args, Users, event, Threads, utils }) {
  const { threadID, messageID, senderID, mentions } = event;

  const filePath = `${__dirname}/cache/bans.json`;

  // ডেটা ফাইল তৈরি
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ warns: {}, banned: {} }, null, 2));
  }

  const bans = JSON.parse(fs.readFileSync(filePath));
  if (!bans.warns[threadID]) bans.warns[threadID] = {};
  if (!bans.banned[threadID]) bans.banned[threadID] = [];

  const save = () => fs.writeFileSync(filePath, JSON.stringify(bans, null, 2));

  const isAdmin = (await api.getThreadInfo(threadID)).adminIDs.some(i => i.id === senderID)
    || global.config.ADMINBOT.includes(senderID);

  if (!isAdmin) return api.sendMessage("❌ শুধুমাত্র অ্যাডমিনরা এই কমান্ডটি ব্যবহার করতে পারবে।", threadID, messageID);

  // 🔍 View warn
  if (args[0] === "view") {
    let msg = "";

    if (Object.keys(mentions).length > 0) {
      for (let id of Object.keys(mentions)) {
        const name = (await api.getUserInfo(id))[id].name;
        const reasons = bans.warns[threadID][id] || [];
        if (reasons.length === 0) msg += `🔸 ${name} এখনও কোনো ওয়ার্ন পায়নি।\n`;
        else msg += `⚠️ ${name} এর ওয়ার্ন:\n- ${reasons.join("\n- ")}\n\n`;
      }
    } else {
      const reasons = bans.warns[threadID][senderID] || [];
      if (reasons.length === 0) return api.sendMessage("✅ আপনি এখনও কোনো ওয়ার্ন পাননি।", threadID, messageID);
      msg = `⚠️ আপনার ওয়ার্ন:\n- ${reasons.join("\n- ")}`;
    }

    return api.sendMessage(msg, threadID, messageID);
  }

  // 📋 List banned users
  if (args[0] === "listban") {
    const list = bans.banned[threadID];
    if (list.length === 0) return api.sendMessage("✅ এই গ্রুপে এখনো কাউকে ব্যান করা হয়নি।", threadID, messageID);

    let msg = "❌ ব্যানকৃত সদস্য:\n";
    for (let uid of list) {
      const name = (await api.getUserInfo(uid))[uid]?.name || uid;
      msg += `🔹 ${name} (UID: ${uid})\n`;
    }
    return api.sendMessage(msg, threadID, messageID);
  }

  // 🔓 Unban
  if (args[0] === "unban") {
    const uid = args[1];
    if (!uid) return api.sendMessage("⚠️ ব্যান খুলতে UID দিন।", threadID, messageID);

    const list = bans.banned[threadID];
    if (!list.includes(uid)) return api.sendMessage("✅ এই ব্যবহারকারী ব্যান করা হয়নি।", threadID, messageID);

    list.splice(list.indexOf(uid), 1);
    delete bans.warns[threadID][uid];
    save();
    return api.sendMessage(`✅ ${uid} এর ব্যান রিমুভ করা হয়েছে।`, threadID, messageID);
  }

  // 🧹 Reset all
  if (args[0] === "reset") {
    bans.warns[threadID] = {};
    bans.banned[threadID] = [];
    save();
    return api.sendMessage("🔄 এই গ্রুপের সব ওয়ার্ন ও ব্যান ডেটা রিসেট করা হয়েছে।", threadID, messageID);
  }

  // ⚠️ Warn/Ban someone
  const idWarn = [];

  // From reply
  if (event.type === "message_reply") {
    idWarn.push(event.messageReply.senderID);
  }
  // From tag
  else if (Object.keys(mentions).length > 0) {
    idWarn.push(...Object.keys(mentions));
  } else {
    return api.sendMessage("⚠️ ওয়ার্ন দিতে হলে কাউকে ট্যাগ বা রিপ্লাই করুন।", threadID, messageID);
  }

  let reason = args.join(" ").replace(/"/g, "").trim();
  if (!reason) reason = "কারণ দেওয়া হয়নি।";

  const tagList = [];
  const nameList = [];

  for (let uid of idWarn) {
    const name = (await api.getUserInfo(uid))[uid].name;
    tagList.push({ id: uid, tag: name });
    nameList.push(name);

    if (!bans.warns[threadID][uid]) bans.warns[threadID][uid] = [];
    bans.warns[threadID][uid].push(reason);

    if (bans.warns[threadID][uid].length >= 2 && !bans.banned[threadID].includes(uid)) {
      bans.banned[threadID].push(uid);
      try {
        await api.removeUserFromGroup(uid, threadID);
      } catch (e) {
        api.sendMessage(`⚠️ ${name} কে গ্রুপ থেকে রিমুভ করা যায়নি।`, threadID);
      }
    }
  }

  save();
  return api.sendMessage(
    {
      body: `❌ ${nameList.join(", ")} কে ওয়ার্ন দেওয়া হয়েছে।\n📝 কারণ: ${reason}`,
      mentions: tagList
    },
    threadID,
    messageID
  );
};
