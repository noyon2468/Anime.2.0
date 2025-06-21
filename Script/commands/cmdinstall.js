const fs = require("fs");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "install",
  version: "1.0.1",
  hasPermission: 0 ,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "JS কোড reply দিলে তা ফাইল আকারে ইনস্টল করে (আগের ফাইল থাকলে ডিলিট করে)",
  commandCategory: "utility",
  usages: "install",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply } = event;

  if (!messageReply || !messageReply.body)
    return api.sendMessage("⚠️ দয়া করে যে কোড ইনস্টল করতে চান, তার উপর reply দিয়ে `install` লিখুন।", threadID, messageID);

  const content = messageReply.body.trim();
  const lines = content.split("\n");

  const firstLine = lines[0];
  const fileNameMatch = firstLine.match(/\/\/\s*file:\s*(.*\.js)/i);
  const fileName = fileNameMatch ? fileNameMatch[1].trim() : null;

  if (!fileName)
    return api.sendMessage("❌ দয়া করে প্রথম লাইনে `// file: filename.js` লিখে কোড দিন।", threadID, messageID);

  if (fileName.includes("..") || !fileName.endsWith(".js"))
    return api.sendMessage("❌ অবৈধ বা অনুমোদনহীন ফাইল নাম!", threadID, messageID);

  // Syntax check
  try {
    new vm.Script(content);
  } catch (err) {
    return api.sendMessage(`❌ কোডে সমস্যা:\n\n${err.message}`, threadID, messageID);
  }

  const filePath = path.join(__dirname, fileName);

  // If file exists, delete before install
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      return api.sendMessage(`❌ পুরাতন ফাইল মুছতে সমস্যা:\n${err.message}`, threadID, messageID);
    }
  }

  // Write new file
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    api.sendMessage(`✅ ${fileName} সফলভাবে ইনস্টল হয়েছে (আগের ফাইল থাকলে তা মুছে ফেলা হয়েছে)।\n📁 Path: ${filePath}`, threadID, messageID);
  } catch (e) {
    api.sendMessage("❌ ফাইল তৈরি করতে ব্যর্থ!", threadID, messageID);
  }
};
