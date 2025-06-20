module.exports.config = {
  name: "ckbot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "ইউজার/গ্রুপ/এডমিনের তথ্য চেক করো",
  commandCategory: "utility",
  usages: "[user | user @tag | user uid | box | box tid | admin]",
  cooldowns: 4
};

module.exports.run = async ({ api, event, args }) => {
  const fs = require("fs-extra");
  const request = require("request");
  const axios = require("axios");

  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  const send = (msg, attachment = null) => {
    const msgData = { body: msg };
    if (attachment) msgData.attachment = fs.createReadStream(attachment);
    return api.sendMessage(msgData, threadID, () => {
      if (attachment) fs.unlinkSync(attachment);
    }, messageID);
  };

  const getUserInfoFormatted = async (id) => {
    const info = await api.getUserInfo(id);
    const data = info[id];
    const gender = data.gender == 1 ? "👧 Female" : data.gender == 2 ? "👦 Male" : "🌀 Unknown";
    const friend = data.isFriend ? "✅ Yes" : "❌ No";
    const profilePic = `https://graph.facebook.com/${id}/picture?width=720&height=720`;

    const path = __dirname + `/cache/${id}.png`;
    await new Promise((resolve) =>
      request(encodeURI(profilePic))
        .pipe(fs.createWriteStream(path))
        .on("close", resolve)
    );

    const content = `👤 নাম: ${data.name}\n🌐 প্রোফাইল: ${data.profileUrl}\n✒️ ইউজারনেম: ${data.vanity || "N/A"}\n🆔 UID: ${id}\n🧬 জেন্ডার: ${gender}\n🤝 বটের ফ্রেন্ড: ${friend}`;
    return [content, path];
  };

  const getThreadInfoFormatted = async (tid) => {
    const info = await api.getThreadInfo(tid);
    const name = info.threadName || "Unnamed Group";
    const emoji = info.emoji || "❔";
    const memberCount = info.participantIDs.length;
    const adminCount = info.adminIDs.length;
    const male = info.userInfo.filter(u => u.gender == "MALE").length;
    const female = info.userInfo.filter(u => u.gender == "FEMALE").length;
    const approval = info.approvalMode ? "✅ On" : "❌ Off";
    const image = info.imageSrc;
    const path = __dirname + `/cache/thread_${tid}.png`;

    if (image) {
      await new Promise((resolve) =>
        request(encodeURI(image))
          .pipe(fs.createWriteStream(path))
          .on("close", resolve)
      );
    }

    const content = `📝 গ্রুপ নাম: ${name}\n🆔 TID: ${tid}\n😃 ইমোজি: ${emoji}\n👮 এপ্রুভাল: ${approval}\n👥 মেম্বার: ${memberCount}\n👑 অ্যাডমিন: ${adminCount}\n👦 ছেলে: ${male}, 👧 মেয়ে: ${female}\n💬 টোটাল মেসেজ: ${info.messageCount}`;

    return [content, image ? path : null];
  };

  // Command Handling
  if (args[0] === "admin") {
    const adminInfo = `🧠 Bot Admin Info\n\n👤 নাম: নূর মোহাম্মদ\n🌐 ফেসবুক: https://facebook.com/nur.mohammad.367314\n🛠️ BOT: ${global.config.BOTNAME || "Messenger Bot"}`;
    const path = __dirname + "/cache/admin.png";
    await new Promise((resolve) =>
      request("https://graph.facebook.com/100086680386976/picture?width=720&height=720")
        .pipe(fs.createWriteStream(path))
        .on("close", resolve)
    );
    return send(adminInfo, path);
  }

  if (args[0] === "user") {
    let targetID;

    if (args[1] && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args[1] && !isNaN(args[1])) {
      targetID = args[1];
    } else if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else {
      targetID = senderID;
    }

    const [msg, imgPath] = await getUserInfoFormatted(targetID);
    return send(msg, imgPath);
  }

  if (args[0] === "box") {
    const tid = args[1] || threadID;
    const [msg, imgPath] = await getThreadInfoFormatted(tid);
    return send(msg, imgPath);
  }

  // Help message
  const prefix = global.config.PREFIX || "!";
  return send(
    `🔍 ব্যবহার:\n\n${prefix}ckbot user → নিজের ইনফো\n${prefix}ckbot user @mention → ট্যাগ করা ইউজারের ইনফো\n${prefix}ckbot user 1000... → নির্দিষ্ট UID ইনফো\n${prefix}ckbot box → গ্রুপের ইনফো\n${prefix}ckbot box [tid] → নির্দিষ্ট TID ইনফো\n${prefix}ckbot admin → বট এডমিন ইনফো`
  );
};
