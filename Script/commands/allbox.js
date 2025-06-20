const moment = require("moment-timezone");

module.exports.config = {
  name: 'allbox',
  version: '1.0.1',
  credits: 'নূর মোহাম্মদ ',
  hasPermssion: 2,
  description: '[ban/unban/del/out] - বট যেসব গ্রুপে আছে সেগুলো ম্যানেজ করুন',
  commandCategory: 'admin',
  usages: '[page number/all]',
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, Threads, handleReply }) {
  if (parseInt(event.senderID) !== 100035389598342) return api.sendMessage("❌ শুধুমাত্র নূর মোহাম্মদ এই কমান্ডটি ব্যবহার করতে পারেন!", event.threadID);

  const { threadID, messageID } = event;
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");
  const args = event.body.trim().split(" ");
  const idgr = handleReply.groupid[args[1] - 1];
  const groupName = handleReply.groupName[args[1] - 1];

  switch (args[0].toLowerCase()) {
    case "ban": {
      const data = (await Threads.getData(idgr)).data || {};
      data.banned = 1;
      data.dateAdded = time;
      await Threads.setData(idgr, { data });
      global.data.threadBanned.set(idgr, { dateAdded: time });

      return api.sendMessage(
        `📛 গ্রুপটি ব্যান করা হয়েছে!\n\n🔷 গ্রুপ: ${groupName}\n🔰 TID: ${idgr}`,
        threadID,
        () => api.unsendMessage(handleReply.messageID)
      );
    }

    case "unban":
    case "ub": {
      const data = (await Threads.getData(idgr)).data || {};
      data.banned = 0;
      data.dateAdded = null;
      await Threads.setData(idgr, { data });
      global.data.threadBanned.delete(idgr);

      return api.sendMessage(
        `✅ গ্রুপ আনব্যান করা হয়েছে!\n\n🔷 গ্রুপ: ${groupName}\n🔰 TID: ${idgr}`,
        threadID,
        () => api.unsendMessage(handleReply.messageID)
      );
    }

    case "del": {
      await Threads.delData(idgr);
      return api.sendMessage(
        `🗑️ ডাটা ডিলিট সফল!\n\n🔷 গ্রুপ: ${groupName}\n🔰 TID: ${idgr}`,
        threadID,
        () => api.unsendMessage(handleReply.messageID)
      );
    }

    case "out": {
      return api.sendMessage(
        `👋 বট গ্রুপ থেকে রিমুভ হচ্ছে...\n\n🔷 গ্রুপ: ${groupName}\n🔰 TID: ${idgr}`,
        threadID,
        () => {
          api.unsendMessage(handleReply.messageID);
          api.removeUserFromGroup(api.getCurrentUserID(), idgr);
        }
      );
    }

    default:
      return api.sendMessage("⚠️ কমান্ড সঠিক নয়! ব্যবহার করুন: ban/unban/del/out [নম্বর]", threadID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (parseInt(event.senderID) !== 100035389598342) return api.sendMessage("❌ শুধুমাত্র নূর মোহাম্মদ এই কমান্ডটি ব্যবহার করতে পারেন!", event.threadID);

  const { threadID } = event;
  const page = parseInt(args[0]) || 1;
  const limit = 100;

  let data;
  try {
    data = await api.getThreadList(100, null, ["INBOX"]);
  } catch (e) {
    return api.sendMessage("❌ থ্রেড লিস্ট আনতে সমস্যা হয়েছে।", threadID);
  }

  const threadList = data
    .filter(t => t.isGroup)
    .map(t => ({
      threadName: t.name || "Unnamed Group",
      threadID: t.threadID,
      messageCount: t.messageCount || 0
    }))
    .sort((a, b) => b.messageCount - a.messageCount);

  const totalPages = Math.ceil(threadList.length / limit);
  if (page > totalPages) return api.sendMessage("❌ পেজ খুঁজে পাওয়া যায়নি!", threadID);

  const groupid = [];
  const groupName = [];
  let msg = `📦 বট যুক্ত গ্রুপসমূহ [Page ${page}/${totalPages}]\n\n`;

  for (let i = limit * (page - 1); i < limit * page && i < threadList.length; i++) {
    const group = threadList[i];
    msg += `${i + 1}. ${group.threadName}\n🔰 TID: ${group.threadID}\n💬 মেসেজ: ${group.messageCount}\n\n`;
    groupid.push(group.threadID);
    groupName.push(group.threadName);
  }

  msg += "👉 রিপ্লাই দিন: ban/unban/del/out [নম্বর]";

  return api.sendMessage(msg, threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: this.config.name,
      author: event.senderID,
      messageID: info.messageID,
      groupid,
      groupName,
      type: "reply"
    });
  });
};
