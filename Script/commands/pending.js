module.exports.config = {
  name: "pending",
  version: "1.0.5",
  credits: "নূর মোহাম্মদ + ChatGPT",
  hasPermssion: 2,
  description: "Manage bot's pending groups",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.languages = {
  "bn": {
    "invaildNumber": "%1 একটি সঠিক নাম্বার নয়!",
    "cancelSuccess": "সফলভাবে বাতিল করা হয়েছে %1 টি গ্রুপ ✅",
    "notiBox": "✅ আপনার গ্রুপটিকে নূর মোহাম্মদ দ্বারা অনুমোদন করা হয়েছে!\nআপনি এখন বট চালাতে পারবেন। \nℹ️ কমান্ড দেখুন: /help",
    "approveSuccess": "সফলভাবে অনুমোদন দেওয়া হয়েছে %1 টি গ্রুপে ✅",
    "cantGetPendingList": "পেন্ডিং গ্রুপ লিস্ট পাওয়া যাচ্ছে না ❌",
    "returnListPending": "📍 মোট পেন্ডিং গ্রুপ: %1 টি\n\n%2\n\n✏️ রিপ্লাই দিয়ে গ্রুপ অ্যাপ্রুভ (1 2) বা বাতিল করতে (c1 c2) লিখুন।",
    "returnListClean": "✅ কোনো পেন্ডিং গ্রুপ নেই!"
  }
};

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
  if (String(event.senderID) !== String(handleReply.author)) return;
  const { body, threadID, messageID } = event;
  let count = 0;

  if (body.toLowerCase().startsWith("c")) {
    const indexList = body.slice(1).trim().split(/\s+/);
    for (const idx of indexList) {
      if (isNaN(idx) || idx <= 0 || idx > handleReply.pending.length)
        return api.sendMessage(getText("invaildNumber", idx), threadID, messageID);
      await api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[idx - 1].threadID);
      count++;
    }
    return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
  } else {
    const indexList = body.trim().split(/\s+/);
    for (const idx of indexList) {
      if (isNaN(idx) || idx <= 0 || idx > handleReply.pending.length)
        return api.sendMessage(getText("invaildNumber", idx), threadID, messageID);
      await api.sendMessage(getText("notiBox"), handleReply.pending[idx - 1].threadID);
      count++;
    }
    return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
  }
};

module.exports.run = async function({ api, event, getText }) {
  const { threadID, messageID } = event;
  const commandName = this.config.name;
  let msg = "", index = 1;

  try {
    const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
    const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
    const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const group of list) {
      msg += `${index++}. ${group.name} (${group.threadID})\n`;
    }

    if (list.length > 0) {
      return api.sendMessage(getText("returnListPending", list.length, msg), threadID, (err, info) => {
        global.client.handleReply.push({
          name: commandName,
          messageID: info.messageID,
          author: event.senderID,
          pending: list
        });
      }, messageID);
    } else {
      return api.sendMessage(getText("returnListClean"), threadID, messageID);
    }

  } catch (e) {
    console.error(e);
    return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
  }
};
