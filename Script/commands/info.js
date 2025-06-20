module.exports.config = {
 name: "info",
 version: "1.3.0",
 hasPermssion: 0,
 credits: "Nur Muhammad + ChatGPT",
 description: "নূর মোহাম্মদের বটের তথ্য",
 commandCategory: "For users",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
 const fs = global.nodemodule["fs-extra"];
 const request = global.nodemodule["request"];
 const moment = require("moment-timezone");

 const PREFIX = global.config.PREFIX;
 const namebot = global.config.BOTNAME;
 const { commands } = global.client;
 const timeStart = Date.now();
 const uptime = process.uptime();
 const hours = Math.floor(uptime / (60 * 60));
 const minutes = Math.floor((uptime % (60 * 60)) / 60);
 const seconds = Math.floor(uptime % 60);
 const date = moment.tz("Asia/Dhaka").format("hh:mm:ss A");

 const totalUsers = global.data.allUserID.length;
 const totalThreads = global.data.allThreadID.length;

 const profileImageLinks = [
   "https://i.imgur.com/WXQIgMz.jpeg",
   "https://i.imgur.com/hU1HvJh.jpeg",
   "https://i.postimg.cc/QdgH08j6/Messenger-creation.gif"
 ];

 const imageLink = profileImageLinks[Math.floor(Math.random() * profileImageLinks.length)];

 const message = 
`🌸───『 ${namebot} BOT STATUS 』───🌸

📍𝗣𝗿𝗲𝗳𝗶𝘅 (সিস্টেম): ${PREFIX}
📍𝗠োডিউল সংখ্যা: ${commands.size}
📍𝗥𝗲𝘀𝗽𝗼𝗻𝘀 𝗧𝗶𝗺𝗲: ${Date.now() - timeStart}ms
📍𝗧𝗼𝘁𝗮𝗹 ইউজার: ${totalUsers}
📍𝗧𝗼𝘁𝗮𝗹 গ্রুপ: ${totalThreads}
📍𝗨𝗽𝗧𝗶𝗺𝗲: ${hours} ঘন্টা ${minutes} মিনিট ${seconds} সেকেন্ড
📍𝗧𝗶𝗺𝗲 𝗡𝗼𝘄: ${date}

🌟───『 Bot Owner Info 』───🌟

👤 নাম: নূর মোহাম্মদ
📌 লোকেশন: ঢাকা, গাজীপুর
🔗 প্রোফাইল: https://www.facebook.com/profile.php?id=100035389598342
📱 হোয়াটসঅ্যাপ: [ব্যক্তিগত]

❤️ ধন্যবাদ বট ব্যবহারের জন্য!`;

 const callback = () => api.sendMessage({
   body: message,
   attachment: fs.createReadStream(__dirname + "/cache/nurinfo.jpg")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/nurinfo.jpg"));

 request(encodeURI(imageLink)).pipe(fs.createWriteStream(__dirname + "/cache/nurinfo.jpg")).on("close", callback);
};
