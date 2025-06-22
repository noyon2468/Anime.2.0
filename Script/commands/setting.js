module.exports.config = {
  name: "settings",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Islamick Cyber ",
  description: "Admin control panel",
  commandCategory: "admin",
  usages: "",
  cooldowns: 10,
};

const OWNER_ID = "100035389598342";
const fs = require("fs-extra");

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  if (senderID !== OWNER_ID) {
    return api.sendMessage(
      `═════════════════\n✨ Only Maharaja নূর মোহাম্মদ is authorized to use this command.\n✨ তুমি তো কেবল প্রজা! এই কমান্ড তোর জন্য না 🙂🐸\n═════════════════\n\n"settings"`,
      threadID,
      messageID
    );
  }

  return api.sendMessage({
    body: `👑 নূর মোহাম্মদের এডমিন প্যানেল 👑\n━━━━━━━━━━━━━\n[1] 🔁 Restart BOT\n[2] 🔄 Reload Config\n[3] 📥 Update Box Data\n[4] 👤 Update User Data\n[5] 🚪 Logout BOT\n━━━━━━━━━━━━━\n[6] 🔓 Toggle AdminOnly Mode\n[7] 🚫 Toggle Join Block\n[8] 🛡️ Anti Robbery Mode\n[9] ❗ Anti-Out Mode\n[10] 🧹 Kick 'Facebook Users'\n━━━━━━━━━━━━━\n[11] ℹ️ BOT Info\n[12] 🏠 Box Info\n[13] 👑 List Admins\n[14] 📘 Admin Book\n[15] 📋 Group List\n━━━━━━━━━━━━━\n💬 রিপ্লাই দিয়ে একটি অপশন বেছে নিন!`,
  }, threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      type: "choosee"
    });
  }, messageID);
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, messageID, senderID } = event;

  if (senderID !== OWNER_ID) {
    return api.sendMessage(
      `═════════════════\n✨ Only Maharaja নূর মোহাম্মদ is authorized to use this command.\n✨ তুমি তো কেবল প্রজা! এই কমান্ড তোর জন্য না 🙂🐸\n═════════════════`,
      threadID,
      messageID
    );
  }

  switch (handleReply.type) {
    case "choosee": {
      switch (event.body) {
        case "1": return api.sendMessage("✅ Bot restarting...", threadID, () => process.exit(1));
        case "2": {
          delete require.cache[require.resolve(global.client.configPath)];
          global.config = require(global.client.configPath);
          return api.sendMessage("✅ Config.json reloaded successfully!", threadID);
        }
        case "3": {
          const Threads = global.controllers.Threads;
          let inbox = await api.getThreadList(100, null, ['INBOX']);
          let list = inbox.filter(group => group.isGroup && group.isSubscribed);
          for (let group of list) {
            let info = await api.getThreadInfo(group.threadID);
            await Threads.setData(group.threadID, { threadInfo: info });
          }
          return api.sendMessage(`✅ Updated ${list.length} group data.`, threadID);
        }
        case "4": {
          const Users = global.controllers.Users;
          const Threads = global.controllers.Threads;
          let inbox = await api.getThreadList(100, null, ['INBOX']);
          let list = inbox.filter(group => group.isGroup && group.isSubscribed);
          for (let group of list) {
            let { participantIDs } = await api.getThreadInfo(group.threadID);
            for (let uid of participantIDs) {
              let info = await api.getUserInfo(uid);
              await Users.setData(uid, { name: info[uid].name });
            }
          }
          return api.sendMessage("✅ All user data updated successfully!", threadID);
        }
        case "5": return api.sendMessage("🔒 Logging out...", threadID, () => api.logout());
        case "6": {
          const dataPath = __dirname + "/cache/data.json";
          let data = fs.readJsonSync(dataPath);
          data.adminbox = data.adminbox || {};
          data.adminbox[threadID] = !data.adminbox[threadID];
          fs.writeJsonSync(dataPath, data, { spaces: 2 });
          return api.sendMessage(
            data.adminbox[threadID]
              ? "🔐 Admin-only mode enabled."
              : "🔓 Admin-only mode disabled.",
            threadID
          );
        }
        case "7": {
          const Threads = global.controllers.Threads;
          let thread = await Threads.getData(threadID);
          thread.data = thread.data || {};
          thread.data.newMember = !thread.data.newMember;
          await Threads.setData(threadID, thread);
          return api.sendMessage(
            thread.data.newMember
              ? "🚫 User join blocked."
              : "✅ User join allowed.",
            threadID
          );
        }
        case "8": {
          const Threads = global.controllers.Threads;
          let thread = await Threads.getData(threadID);
          thread.data = thread.data || {};
          thread.data.guard = !thread.data.guard;
          await Threads.setData(threadID, thread);
          return api.sendMessage(
            thread.data.guard
              ? "🛡️ Anti-robbery enabled."
              : "⚠️ Anti-robbery disabled.",
            threadID
          );
        }
        case "9": {
          const Threads = global.controllers.Threads;
          let thread = await Threads.getData(threadID);
          thread.data = thread.data || {};
          thread.data.antiout = !thread.data.antiout;
          await Threads.setData(threadID, thread);
          return api.sendMessage(
            thread.data.antiout
              ? "❗ Anti-out mode ON."
              : "✅ Anti-out mode OFF.",
            threadID
          );
        }
        case "10": {
          let info = await api.getThreadInfo(threadID);
          let toKick = info.userInfo.filter(u => !u.gender).map(u => u.id);
          for (let uid of toKick) {
            try {
              await new Promise(r => setTimeout(r, 1000));
              await api.removeUserFromGroup(uid, threadID);
            } catch {}
          }
          return api.sendMessage(`✅ Removed ${toKick.length} 'Facebook User'`, threadID);
        }
        case "11": {
          const moment = require("moment-timezone");
          const uptime = process.uptime();
          const hours = Math.floor(uptime / 3600);
          const minutes = Math.floor((uptime % 3600) / 60);
          const seconds = Math.floor(uptime % 60);
          return api.sendMessage(
            `🤖 BOT Info\n━━━━━━━━━━━━\n👑 Owner: নূর মোহাম্মদ\n⏰ Uptime: ${hours}h ${minutes}m ${seconds}s\n👥 Total Users: ${global.data.allUserID.length}\n👨‍👩‍👧‍👦 Total Groups: ${global.data.allThreadID.length}`,
            threadID
          );
        }
        case "12": {
          let info = await api.getThreadInfo(threadID);
          return api.sendMessage(
            `🏠 Box Name: ${info.threadName}\n🆔 Box ID: ${threadID}\n👥 Members: ${info.participantIDs.length}\n👑 Admins: ${info.adminIDs.length}\n💬 Messages: ${info.messageCount}`,
            threadID
          );
        }
        case "13": {
          let info = await api.getThreadInfo(threadID);
          let text = `👑 Admins List:\n━━━━━━━━━━━━━\n`;
          for (let ad of info.adminIDs) {
            let user = await api.getUserInfo(ad.id);
            text += `• ${user[ad.id].name} (${ad.id})\n`;
          }
          return api.sendMessage(text, threadID);
        }
        case "14": {
          let admins = global.config.ADMINBOT;
          let msg = `📘 Admin Book:\n━━━━━━━━━━━━━\n`;
          for (let id of admins) {
            let name = (await api.getUserInfo(id))[id]?.name || "Unknown";
            msg += `• ${name} → fb.me/${id}\n`;
          }
          return api.sendMessage(msg, threadID);
        }
        case "15": {
          let inbox = await api.getThreadList(200, null, ["INBOX"]);
          let list = inbox.filter(g => g.isGroup && g.isSubscribed);
          let text = `📋 Group List:\n━━━━━━━━━━━━━\n`;
          list.forEach((g, i) => {
            text += `${i + 1}. ${g.name || "No Name"}\n🆔 ${g.threadID}\n\n`;
          });
          return api.sendMessage(text, threadID);
        }
      }
    }
  }
};

            
