module.exports.config = {
  name: "avt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "ব্যবহারকারীর অ্যাভাটার বা গ্রুপের ছবি দেখাও",
  commandCategory: "tools",
  cooldowns: 3
};

const fs = require("fs");
const request = require("request");
const axios = require("axios");
const tool = require("fb-tools");

module.exports.run = async function({ api, event, args, Threads }) {
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;
  const cmd = this.config.name;

  if (!args[0]) {
    return api.sendMessage(
      `[🖼️] অ্যাভাটার কমান্ডের নির্দেশনা:\n\n` +
      `📌 ${prefix}${cmd} box — গ্রুপের কভার ছবি দেখাবে\n` +
      `📌 ${prefix}${cmd} id [UID] — নির্দিষ্ট UID এর অ্যাভাটার\n` +
      `📌 ${prefix}${cmd} link [FB লিংক] — লিংক থেকে UID বের করে অ্যাভাটার\n` +
      `📌 ${prefix}${cmd} user — নিজের অ্যাভাটার\n` +
      `📌 ${prefix}${cmd} user [@mention] — ট্যাগকৃত ব্যক্তির অ্যাভাটার`,
      event.threadID, event.messageID
    );
  }

  // 📷 Box avatar
  if (args[0] == "box") {
    const targetID = args[1] || event.threadID;
    const threadInfo = await api.getThreadInfo(targetID);
    if (!threadInfo.imageSrc)
      return api.sendMessage(`📁 গ্রুপ "${threadInfo.threadName}" এর কোনো কভার ছবি নেই।`, event.threadID, event.messageID);

    const callback = () =>
      api.sendMessage({
        body: `📷 গ্রুপ "${threadInfo.threadName}" এর কভার ছবি`,
        attachment: fs.createReadStream(__dirname + "/cache/avt.png")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);

    return request(encodeURI(threadInfo.imageSrc))
      .pipe(fs.createWriteStream(__dirname + "/cache/avt.png"))
      .on("close", callback);
  }

  // 👤 Avatar by UID
  if (args[0] == "id") {
    const uid = args[1];
    if (!uid) return api.sendMessage(`⚠️ দয়া করে একটি UID দিন।`, event.threadID, event.messageID);

    const callback = () =>
      api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/avt.png") },
        event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);

    return request(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)
      .pipe(fs.createWriteStream(__dirname + "/cache/avt.png"))
      .on("close", callback);
  }

  // 🔗 Avatar by FB Link
  if (args[0] == "link") {
    const link = args[1];
    if (!link) return api.sendMessage(`⚠️ দয়া করে একটি ফেসবুক লিংক দিন।`, event.threadID, event.messageID);

    try {
      const id = await tool.findUid(link);
      const callback = () =>
        api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/avt.png") },
          event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);

      return request(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)
        .pipe(fs.createWriteStream(__dirname + "/cache/avt.png"))
        .on("close", callback);
    } catch (e) {
      return api.sendMessage(`❌ লিংকের UID খুঁজে পাওয়া যায়নি।`, event.threadID, event.messageID);
    }
  }

  // 👥 Avatar of user/self/mentions
  if (args[0] == "user") {
    let uid = event.senderID;

    // যদি কেউ ট্যাগ করে
    if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    }

    const callback = () =>
      api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/avt.png") },
        event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);

    return request(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)
      .pipe(fs.createWriteStream(__dirname + "/cache/avt.png"))
      .on("close", callback);
  }

  // ❓ Default fallback
  return api.sendMessage(`❓ ভুল কমান্ড! ${prefix}${cmd} লিখে নির্দেশনা দেখুন।`, event.threadID, event.messageID);
};
