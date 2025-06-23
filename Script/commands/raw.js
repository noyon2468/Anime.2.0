const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "raw",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐲𝐛𝐞𝐫 + Modified by ChatGPT for নূর মোহাম্মদ",
  description: "📄 .js ফাইলের raw কোড দেখুন অথবা ডিলিট করুন (Nur মোহাম্মদের জন্য)",
  commandCategory: "admin",
  usages: "raw\nreply with: [file_number] [raw/del]",
  cooldowns: 0,
};

const OWNER_ID = "100035389598342"; // নূর মোহাম্মদ

module.exports.run = async function ({ event, api }) {
  if (event.senderID !== OWNER_ID)
    return api.sendMessage("❌ এই কমান্ডটি শুধুমাত্র নূর মোহাম্মদের জন্য।", event.threadID, event.messageID);

  const folderPath = __dirname;
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));
  if (!files.length) return api.sendMessage("⚠️ কোনো .js ফাইল খুঁজে পাওয়া যায়নি!", event.threadID, event.messageID);

  let msg = "📂 আপনার কমান্ড ফোল্ডারের ফাইল তালিকা:\n\n";
  files.forEach((file, i) => {
    msg += `${i + 1}. ${file}\n`;
  });
  msg += `\n✏️ রিপ্লাই দিন: [ফাইল নাম্বার] [raw/del]`;

  api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      files
    });
  }, event.messageID);
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
  if (event.senderID !== handleReply.author)
    return api.sendMessage("⛔ আপনি এই রিপ্লাইটি ব্যবহার করতে পারেন না।", event.threadID, event.messageID);

  const args = event.body.trim().split(" ");
  const number = parseInt(args[0]);
  const action = args[1]?.toLowerCase();

  if (isNaN(number) || !["raw", "del"].includes(action))
    return api.sendMessage("❌ ভুল ইনপুট!\nউদাহরণ: 1 raw অথবা 2 del", event.threadID, event.messageID);

  const fileName = handleReply.files[number - 1];
  if (!fileName)
    return api.sendMessage("❌ ফাইল নাম্বার ভুল।", event.threadID, event.messageID);

  const filePath = path.join(__dirname, fileName);

  if (action === "del") {
    fs.unlinkSync(filePath);
    return api.sendMessage(`🗑️ ${fileName} ফাইলটি সফলভাবে ডিলিট করা হয়েছে।`, event.threadID, event.messageID);
  }

  if (action === "raw") {
    const content = fs.readFileSync(filePath, "utf-8");

    try {
      const res = await axios.post("https://api.mocky.io/api/mock", {
        status: 200,
        content,
        content_type: "application/json",
        charset: "UTF-8",
        expiration: "never"
      });

      if (res.data?.link)
        return api.sendMessage(`🔗 ${fileName} এর Raw লিংক:\n${res.data.link}`, event.threadID, event.messageID);
      else
        return api.sendMessage("❌ লিংক জেনারেট করা যায়নি।", event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("❌ mocky.io তে আপলোড করতে ব্যর্থ।", event.threadID, event.messageID);
    }
  }
};
