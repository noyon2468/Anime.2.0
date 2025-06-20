const axios = require("axios");

module.exports.config = {
  name: "islamicvideo",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Shaon × Ullash × নূর মোহাম্মদ",
  description: "ইসলামিক, দুঃখ, ভালোবাসা, কষ্ট ইত্যাদি ভিডিও মেনু পাঠায়",
  commandCategory: "media",
  usages: "[video menu]",
  cooldowns: 5
};

module.exports.run = async function ({ event, api }) {
  const msg = `╭─── 🎥 *𝙰𝙻𝙻 𝚅𝙸𝙳𝙴𝙾𝚂* ───╮

🔹 1️⃣ ইসলামিক ভিডিও  
🔹 2️⃣ Anime ভিডিও  
🔹 3️⃣ Shairi ভিডিও  
🔹 4️⃣ Happy ভিডিও  
🔹 5️⃣ Sad ভিডিও  
🔹 6️⃣ Short ভিডিও  
🔹 7️⃣ Football ভিডিও  
🔹 8️⃣ Funny ভিডিও  
🔹 9️⃣ Love ভিডিও  
🔹 🔟 Status ভিডিও  
🔹 1️⃣1️⃣ Baby ভিডিও  
🔹 1️⃣2️⃣ Free Fire ভিডিও  
🔹 1️⃣3️⃣ Lofi ভিডিও  
🔹 1️⃣4️⃣ Humayun Sir ভিডিও  
🔹 1️⃣5️⃣ BUM ভিডিও  

━━━━━━━━━━━━━━

📝 *নোট:*  
যে নাম্বার ভিডিও দেখতে চাও রিপ্লাই করে সেই নাম্বারটা পাঠাও।  
`;

  return api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      type: "video"
    });
  });
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const number = event.body.trim();
  if (handleReply.author != event.senderID) return;

  const links = {
    "1": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/islamic.json",
    "2": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/anime.json",
    "3": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/shairi.json",
    "4": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/happy.json",
    "5": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/sad.json",
    "6": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/short.json",
    "7": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/football.json",
    "8": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/funny.json",
    "9": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/love.json",
    "10": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/status.json",
    "11": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/baby.json",
    "12": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/freefire.json",
    "13": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/lofi.json",
    "14": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/humayun.json",
    "15": "https://raw.githubusercontent.com/shaonproject/Shaon/main/api/video/bum.json"
  };

  const link = links[number];
  if (!link) return api.sendMessage("❌ ভুল নাম্বার। মেনু থেকে সঠিক নাম্বার রিপ্লাই করো।", event.threadID);

  try {
    const res = await axios.get(link);
    const videoUrl = res.data.url || res.data.result || res.data.link;

    return api.sendMessage({
      body: `📥 নিচে তোমার ভিডিও...`,
      attachment: await global.utils.getStreamFromURL(videoUrl)
    }, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage("⚠️ ভিডিও আনতে সমস্যা হচ্ছে। পরে চেষ্টা করো।", event.threadID);
  }
};
