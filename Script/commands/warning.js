const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "warning",
  version: "2.0.0",
  hasPermission: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "ব্যবহারকারীদের ওয়ার্ন/আনব্যান করার সিস্টেম",
  commandCategory: "admin",
  usages: "[@mention | UID] [কারণ] | all | reset | unban",
  cooldowns: 5
};

const filePath = path.resolve(__dirname, "cache", "listwarning.json");
const OWNER_UID = "100035389598342";

module.exports.onLoad = () => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
};

module.exports.run = async function ({ event, api, args, Users }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;
  const warningData = JSON.parse(fs.readFileSync(filePath));

  // 🔐 শুধুমাত্র নূর মোহাম্মদ পারমিশন পাবে
  if (senderID !== OWNER_UID) return api.sendMessage("❌ শুধু নূর মোহাম্মদ এই কমান্ড চালাতে পারবে!", threadID, messageID);

  // 📄 সব ওয়ার্ন লিস্ট
  if (args[0] === "all") {
    let list = "";
    for (const id in warningData) {
      const name = global.data.userName.get(id) || await Users.getNameUser(id);
      list += `🔹 ${name} ➤ ওয়ার্ন বাকি: ${warningData[id].warningLeft} বার\n`;
    }
    return api.sendMessage(list || "⚠️ এখন পর্যন্ত কেউ ওয়ার্ন পায়নি।", threadID, messageID);
  }

  // 🔄 রিসেট
  if (args[0] === "reset") {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
    return api.sendMessage("✅ সব ওয়ার্ন ডেটা রিসেট হয়েছে!", threadID, messageID);
  }

  // ♻️ আনব্যান
  if (args[0] === "unban") {
    const target = Object.keys(mentions)[0];
    if (!target) return api.sendMessage("⚠️ কাকে আনব্যান করবে ট্যাগ করো!", threadID, messageID);

    delete warningData[target];
    const data = (await Users.getData(target)).data || {};
    data.banned = 0;
    await Users.setData(target, { data });
    global.data.userBanned.delete(parseInt(target));

    return api.sendMessage(`✅ ${mentions[target].replace("@", "")} কে আনব্যান করা হয়েছে!`, threadID, messageID);
  }

  // 🧠 ওয়ার্ন কাকে দিবে?
  const targetID = messageReply?.senderID || Object.keys(mentions)[0] || args[0];
  if (!targetID) return api.sendMessage("⚠️ কাকে ওয়ার্ন করবে? ট্যাগ করো, রিপ্লাই দাও, বা UID দাও!", threadID, messageID);

  const reason = messageReply ? args.join(" ") : args.slice(1).join(" ");
  if (!reason) return api.sendMessage("⚠️ ওয়ার্ন দেওয়ার কারণ লিখো!", threadID, messageID);

  // 📝 ওয়ার্ন প্রক্রিয়া
  let data = warningData[targetID] || { warningLeft: 3, warningReason: [], banned: false };
  if (data.banned) return api.sendMessage("❌ ইউজার ইতিমধ্যে ৩ বার ওয়ার্ন হয়ে ব্যানড!", threadID, messageID);

  data.warningLeft--;
  data.warningReason.push(reason);

  if (data.warningLeft <= 0) {
    data.banned = true;
    const uData = (await Users.getData(targetID)).data || {};
    uData.banned = 1;
    await Users.setData(targetID, { data: uData });
    global.data.userBanned.set(parseInt(targetID), 1);
  }

  warningData[targetID] = data;
  fs.writeFileSync(filePath, JSON.stringify(warningData, null, 2), 'utf-8');

  const name = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
  const statusMsg = data.banned
    ? `⛔ ${name} কে ৩ বার ওয়ার্নের পর ব্যান করা হয়েছে!`
    : `⚠️ ${name} কে ওয়ার্ন করা হয়েছে!\n📝 কারণ: ${reason}\n🧨 ওয়ার্ন বাকি: ${data.warningLeft} বার`;

  return api.sendMessage(statusMsg, threadID, messageID);
};
