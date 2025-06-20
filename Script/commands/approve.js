const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "approve",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "অনুমোদিত থ্রেড পরিচালনা করুন",
  commandCategory: "admin",
  cooldowns: 5
};

const dataDir = __dirname + "/cache/ullash/";
const dataPath = dataDir + "approvedThreads.json";
const pendingPath = dataDir + "pendingThreads.json";

module.exports.onLoad = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));
};

module.exports.run = async function ({ event, api, args, Threads, handleReply, Users }) {
  const { threadID, messageID, senderID } = event;

  let approvedThreads = JSON.parse(fs.readFileSync(dataPath));
  let pendingThreads = JSON.parse(fs.readFileSync(pendingPath));

  const subcommand = args[0];
  const id = args[1] || threadID;

  // Show Approved List
  if (subcommand === "list" || subcommand === "l") {
    let msg = `✅ অনুমোদিত গ্রুপের তালিকা:\n\n`;
    let index = 1;
    for (const tid of approvedThreads) {
      const info = await api.getThreadInfo(tid);
      const name = info.threadName || (await Users.getNameUser(tid));
      msg += `${index++}. ${name}\nID: ${tid}\n\n`;
    }
    return api.sendMessage(msg || "✅ কোনো অনুমোদিত গ্রুপ খুঁজে পাওয়া যায়নি।", threadID, messageID);
  }

  // Show Pending List
  if (subcommand === "pending" || subcommand === "p") {
    let msg = `🔕 অনুমোদনের জন্য অপেক্ষমাণ তালিকা:\n\n`;
    let index = 1;
    for (const tid of pendingThreads) {
      const info = await api.getThreadInfo(tid);
      const name = info.threadName || (await Users.getNameUser(tid));
      msg += `${index++}. ${name}\nID: ${tid}\n\n`;
    }
    return api.sendMessage(msg || "🔕 কোনো pending গ্রুপ খুঁজে পাওয়া যায়নি।", threadID, messageID);
  }

  // Help Command
  if (subcommand === "help" || subcommand === "h") {
    return api.sendMessage(
      `📚 Approve Command Menu:\n\n` +
      `➤ approve [ID] - গ্রুপ অনুমোদন\n` +
      `➤ approve list / l - অনুমোদিত গ্রুপ তালিকা\n` +
      `➤ approve pending / p - pending তালিকা\n` +
      `➤ approve del [ID] - অনুমোদন মুছুন\n\n` +
      `Example: approve 123456789`,
      threadID,
      messageID
    );
  }

  // Delete Approved Thread
  if (subcommand === "del" || subcommand === "d") {
    if (!approvedThreads.includes(id)) {
      return api.sendMessage("❌ এই গ্রুপটি অনুমোদিত তালিকায় নেই।", threadID, messageID);
    }
    approvedThreads = approvedThreads.filter(e => e !== id);
    fs.writeFileSync(dataPath, JSON.stringify(approvedThreads, null, 2));
    return api.sendMessage(`❎ ID: ${id} সফলভাবে অনুমোদন তালিকা থেকে মুছে ফেলা হয়েছে।`, threadID, messageID);
  }

  // Approve New Thread
  if (!approvedThreads.includes(id)) {
    approvedThreads.push(id);
    fs.writeFileSync(dataPath, JSON.stringify(approvedThreads, null, 2));

    pendingThreads = pendingThreads.filter(e => e !== id);
    fs.writeFileSync(pendingPath, JSON.stringify(pendingThreads, null, 2));

    return api.sendMessage(`✅ গ্রুপ অনুমোদিত হয়েছে!\nID: ${id}`, threadID, messageID);
  } else {
    return api.sendMessage("✅ এই গ্রুপ ইতিমধ্যেই অনুমোদিত।", threadID, messageID);
  }
};
