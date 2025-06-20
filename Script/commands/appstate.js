module.exports.config = {
  name: "appstate",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "CYBER TEAM + Customized by ChatGPT",
  description: "Refresh appstate.json file",
  commandCategory: "Admin",
  usages: "appstate",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const fs = require("fs-extra");
  const allowedUID = "100035389598342"; // Nur মোহাম্মদ UID

  if (event.senderID !== allowedUID)
    return api.sendMessage("❌ শুধুমাত্র নূর মোহাম্মদ এই কমান্ড ব্যবহার করতে পারবেন!", event.threadID, event.messageID);

  try {
    const appstate = api.getAppState();
    const data = JSON.stringify(appstate, null, 2);

    fs.writeFile(`${__dirname}/../../appstate.json`, data, 'utf8', (err) => {
      if (err) return api.sendMessage(`❌ ফাইল লেখার সময় সমস্যা হয়েছে:\n${err}`, event.threadID);
      return api.sendMessage("✅ Appstate সফলভাবে রিফ্রেশ করা হয়েছে!", event.threadID);
    });
  } catch (e) {
    return api.sendMessage(`❌ সমস্যা হয়েছে:\n${e.message}`, event.threadID);
  }
};
