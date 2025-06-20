const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autosetname",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ",
  description: "Automatically set nicknames for new members",
  commandCategory: "Box Chat",
  usages: "[add <name> / remove]",
  cooldowns: 5
};

const dataPath = path.join(__dirname, "cache", "autosetname.json");

module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "[]", "utf-8");
};

module.exports.run = async function({ event, api, args, Users }) {
  const { threadID, messageID, senderID } = event;
  if (!args[0]) {
    return api.sendMessage(
      "📌 ব্যবহারের নিয়ম:\n➤ autosetname add <নাম>\n➤ autosetname remove",
      threadID,
      messageID
    );
  }

  let data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  let threadData = data.find(item => item.threadID == threadID);

  if (!threadData) {
    threadData = { threadID, nameUser: [] };
    data.push(threadData);
  }

  const name = (await Users.getData(senderID)).name;
  const content = args.slice(1).join(" ");

  switch (args[0]) {
    case "add":
      if (!content) return api.sendMessage("❌ নতুন সদস্যের নাম ফাঁকা রাখা যাবে না!", threadID, messageID);
      if (threadData.nameUser.length > 0) return api.sendMessage("⚠️ আগে থেকে একটি নাম সেট করা আছে। নতুন নাম সেট করতে হলে আগেরটি মুছুন!", threadID, messageID);
      threadData.nameUser.push(content);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
      return api.sendMessage(`✅ নতুন সদস্যের নাম কনফিগার করা হয়েছে!\nউদাহরণ: ${content} ${name}`, threadID, messageID);

    case "rm":
    case "remove":
    case "delete":
      if (threadData.nameUser.length === 0) return api.sendMessage("ℹ️ কোনো নাম কনফিগার করা হয়নি!", threadID, messageID);
      threadData.nameUser = [];
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
      return api.sendMessage("✅ নতুন সদস্যের নাম কনফিগারেশন মুছে ফেলা হয়েছে।", threadID, messageID);

    default:
      return api.sendMessage("❌ সঠিক ফরম্যাট দিন।\nব্যবহার করুন: autosetname add/remove", threadID, messageID);
  }
};
