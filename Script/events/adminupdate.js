const fs = require("fs");

module.exports.config = {
  name: "adminUpdate",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-icon",
    "log:thread-call",
    "log:thread-color"
  ],
  version: "1.1.0",
  credits: "নূর মোহাম্মদ",
  description: "গ্রুপে যেকোনো পরিবর্তনের উপর রিয়েলটাইম নোটিফিকেশন",
  envConfig: {
    sendNoti: true,
    autoUnsend: false,
    timeToUnsend: 30
  }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const { threadID, logMessageType, logMessageData, author } = event;
  const { setData, getData } = Threads;
  const config = global.configModule[this.config.name];

  let dataThread = (await getData(threadID)).threadInfo || {};
  const threadSetting = global.data.threadData.get(threadID) || {};
  if (typeof threadSetting["adminUpdate"] != "undefined" && threadSetting["adminUpdate"] == false) return;

  const send = async (msg) => {
    if (!config.sendNoti) return;
    api.sendMessage(msg, threadID, async (err, info) => {
      if (config.autoUnsend) {
        await new Promise(res => setTimeout(res, config.timeToUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    });
  };

  try {
    switch (logMessageType) {
      case "log:thread-admins": {
        const targetID = logMessageData.TARGET_ID;
        const name = await Users.getNameUser(targetID);
        if (logMessageData.ADMIN_EVENT === "add_admin") {
          dataThread.adminIDs.push({ id: targetID });
          await send(`😎 এডমিন আপডেট:\n➤ ${name} এখন এই গ্রুপের এডমিন হয়ে গেছে!`);
        } else {
          dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != targetID);
          await send(`😤 এডমিন অপসারণ:\n➤ ${name} কে এডমিন থেকে সরিয়ে দেওয়া হয়েছে!`);
        }
        break;
      }

      case "log:thread-icon": {
        const emojiPath = __dirname + "/emoji.json";
        const iconData = fs.existsSync(emojiPath) ? JSON.parse(fs.readFileSync(emojiPath)) : {};
        const newIcon = logMessageData.thread_icon;
        const prevIcon = iconData[threadID] || "❔";
        iconData[threadID] = newIcon;
        fs.writeFileSync(emojiPath, JSON.stringify(iconData, null, 2));
        await send(`🌟 গ্রুপ আইকন পরিবর্তন:\n➤ পূর্ববর্তী: ${prevIcon}\n➤ নতুন: ${newIcon}`);
        dataThread.threadIcon = newIcon;
        break;
      }

      case "log:thread-call": {
        if (logMessageData.event === "group_call_started") {
          const caller = await Users.getNameUser(logMessageData.caller_id);
          await send(`📞 কল শুরু হয়েছে:\n➤ ${caller} একটি ${logMessageData.video ? 'ভিডিও ' : ''}কল শুরু করেছেন!`);
        } else if (logMessageData.event === "group_call_ended") {
          const duration = logMessageData.call_duration || 0;
          const h = Math.floor(duration / 3600);
          const m = Math.floor((duration % 3600) / 60);
          const s = duration % 60;
          await send(`📴 কল শেষ হয়েছে:\n➤ সময়কাল: ${h}h ${m}m ${s}s`);
        } else if (logMessageData.joining_user) {
          const joiner = await Users.getNameUser(logMessageData.joining_user);
          await send(`🧏‍♂️ কল জয়েন করেছে:\n➤ ${joiner}`);
        }
        break;
      }

      case "log:thread-color": {
        const newColor = logMessageData.thread_color || "unknown";
        dataThread.threadColor = newColor;
        await send(`🎨 থিম কালার পরিবর্তন:\n➤ ${event.logMessageBody.replace("Theme", "Color")}`);
        break;
      }

      case "log:user-nickname": {
        const uid = logMessageData.participant_id;
        const nickname = logMessageData.nickname;
        const name = await Users.getNameUser(uid);
        if (!dataThread.nicknames) dataThread.nicknames = {};
        dataThread.nicknames[uid] = nickname;
        await send(`📛 নিকনেম আপডেট:\n➤ ${name} এখন পরিচিত ${nickname.length === 0 ? "মূল নাম" : `"${nickname}"`} নামে!`);
        break;
      }

      case "log:thread-name": {
        const newName = logMessageData.name || "Unnamed";
        dataThread.threadName = newName;
        await send(`📢 গ্রুপ নাম পরিবর্তন:\n➤ নতুন নাম: ${newName}`);
        break;
      }
    }

    await setData(threadID, { threadInfo: dataThread });
  } catch (err) {
    console.error("[adminUpdate ERROR]:", err);
  }
};
