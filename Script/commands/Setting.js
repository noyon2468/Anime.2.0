const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "settings",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "নূর মোহাম্মদ",
  description: "বট কন্ট্রোল প্যানেল",
  commandCategory: "admin",
  usages: "",
  cooldowns: 5
};

const OWNER_ID = "100035389598342";
const totalPath = path.join(__dirname, "/cache/totalChat.json");
const _24hours = 86400000;

module.exports.onLoad = function () {
  const dataPath = path.join(__dirname, "cache", "data.json");
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({ adminbox: {} }, null, 2));
  } else {
    const data = require(dataPath);
    if (!data.hasOwnProperty("adminbox")) data.adminbox = {};
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  if (senderID !== OWNER_ID) {
    return api.sendMessage("❌ শুধু নূর মোহাম্মদ এই কমান্ড ব্যবহার করতে পারবেন!", threadID, messageID);
  }

  return api.sendMessage(
    `📌 বট কন্ট্রোল মেনু\n━━━━━━━━━━━━━━\n` +
    `1️⃣ বট রিস্টার্ট করুন\n` +
    `2️⃣ config রিলোড করুন\n` +
    `3️⃣ গ্রুপ ডেটা আপডেট\n` +
    `4️⃣ ইউজার ডেটা আপডেট\n` +
    `5️⃣ বট লগআউট করুন\n` +
    `6️⃣ শুধুমাত্র অ্যাডমিন মোড টগল করুন\n` +
    `7️⃣ গ্রুপে নতুন ইউজার প্রবেশ নিষেধ\n` +
    `8️⃣ গ্রুপ নিরাপত্তা (Guard) মোড\n` +
    `9️⃣ Anti-Out মোড চালু/বন্ধ\n` +
    `🔟 'Facebook User' দের কিক দিন\n━━━━━━━━━━━━━━\n` +
    `📝 *একটি নাম্বার রিপ্লাই দিন কাজের জন্য*`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "panel"
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply, Threads, Users }) {
  const { threadID, messageID, senderID, body } = event;

  if (senderID !== OWNER_ID) {
    return api.sendMessage("❌ এই কমান্ড কেবল নূর মোহাম্মদের জন্য অনুমোদিত!", threadID, messageID);
  }

  const send = (msg) => api.sendMessage(msg, threadID, messageID);

  switch (handleReply.type) {
    case "panel": {
      switch (body) {
        case "1": return send("✅ বট রিস্টার্ট হচ্ছে...") || process.exit(1);
        case "2":
          delete require.cache[require.resolve(global.client.configPath)];
          global.config = require(global.client.configPath);
          return send("✅ config.json সফলভাবে রিলোড হয়েছে!");
        case "3": {
          const inbox = await api.getThreadList(100, null, ['INBOX']);
          const list = inbox.filter(g => g.isGroup && g.isSubscribed);
          for (const g of list) {
            const info = await api.getThreadInfo(g.threadID);
            await Threads.setData(g.threadID, { threadInfo: info });
          }
          return send(`✅ ${list.length} টি গ্রুপ ডেটা আপডেট হয়েছে!`);
        }
        case "4": {
          const inbox = await api.getThreadList(100, null, ['INBOX']);
          const groups = inbox.filter(g => g.isGroup && g.isSubscribed);
          for (const group of groups) {
            const info = await api.getThreadInfo(group.threadID);
            for (const id of info.participantIDs) {
              const name = (await api.getUserInfo(id))[id]?.name || "Unknown";
              await Users.setData(id, { name });
            }
          }
          return send("✅ ইউজার ডেটা সফলভাবে আপডেট হয়েছে!");
        }
        case "5":
          send("🚪 বট লগআউট হচ্ছে...");
          return api.logout();
        case "6": {
          const dataPath = path.join(__dirname, "cache", "data.json");
          const data = require(dataPath);
          const current = data.adminbox[threadID] || false;
          data.adminbox[threadID] = !current;
          fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
          return send(current ? "🔓 Admin only মোড বন্ধ করা হয়েছে!" : "🔒 এখন শুধু অ্যাডমিনরা বট চালাতে পারবে!");
        }
        case "7": {
          const thread = (await Threads.getData(threadID)).data || {};
          thread.newMember = !thread.newMember;
          await Threads.setData(threadID, { data: thread });
          global.data.threadData.set(parseInt(threadID), thread);
          return send(thread.newMember ? "🔒 নতুন ইউজার প্রবেশ নিষিদ্ধ!" : "🔓 নতুন ইউজার প্রবেশ আবার চালু!");
        }
        case "8": {
          const thread = (await Threads.getData(threadID)).data || {};
          thread.guard = !thread.guard;
          await Threads.setData(threadID, { data: thread });
          global.data.threadData.set(parseInt(threadID), thread);
          return send(thread.guard ? "🛡️ গ্রুপ গার্ড মোড চালু!" : "⚠️ গ্রুপ গার্ড মোড বন্ধ!");
        }
        case "9": {
          const thread = (await Threads.getData(threadID)).data || {};
          thread.antiout = !thread.antiout;
          await Threads.setData(threadID, { data: thread });
          global.data.threadData.set(parseInt(threadID), thread);
          return send(thread.antiout ? "🧷 Anti-Out মোড চালু!" : "🔓 Anti-Out মোড বন্ধ!");
        }
        case "10": {
          const info = await api.getThreadInfo(threadID);
          const targets = info.userInfo.filter(u => !u.name);
          if (!info.adminIDs.some(ad => ad.id == api.getCurrentUserID())) {
            return send("❌ বটকে আগে অ্যাডমিন বানাও!");
          }
          let success = 0, fail = 0;
          for (const user of targets) {
            try {
              await new Promise(res => setTimeout(res, 1000));
              await api.removeUserFromGroup(user.id, threadID);
              success++;
            } catch { fail++; }
          }
          return send(`✅ ${success} জন 'Facebook User' কিক হয়েছে\n❌ ব্যর্থ: ${fail}`);
        }
        default: return send("❌ অনুগ্রহ করে সঠিক নাম্বার দিন!");
      }
    }
  }
};
