module.exports.config = {
  name: "banner2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Anime ব্যানার বানাও নিজের নামে!",
  commandCategory: "ফান",
  usages: "banner2",
  cooldowns: 5
};

module.exports.run = async function({ api, args, event }) {
  const axios = require('axios');
  const data = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;

  if (args[0] == "find" || args[0] == "tìm") {
    const imgStream = (await axios.get(`${data[args[1]].imgAnime}`, { responseType: "stream" })).data;
    return api.sendMessage({
      body: `🌸 চরিত্র নম্বর: ${args[1]}\n🎨 ডিফল্ট কালার: ${data[args[1]].colorBg} █`,
      attachment: imgStream
    }, event.threadID, event.messageID);
  }

  else if (args[0] == "list") {
    const list = data.listAnime;
    const count = list.length;
    const page = parseInt(args[1]) || 1;
    const limit = 20;
    const totalPages = Math.ceil(count / limit);
    let msg = `📜 মোট চরিত্র: ${count} টি\n📄 পেজ: (${page}/${totalPages})\n\n`;

    for (let i = limit * (page - 1); i < limit * page && i < count; i++) {
      msg += `🔸 [ ${i+1} ] - ${list[i].ID} | ${list[i].name}\n`;
    }

    msg += `\n👉 ব্যবহার করুন: ${global.config.PREFIX}${this.config.name} list <পৃষ্ঠা নম্বর>`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  }

  else {
    return api.sendMessage("🖼️ একটি Anime চরিত্র সিলেক্ট করতে নিচের মেসেজটি রিপ্লাই করুন:", event.threadID, (err, info) => {
      global.client.handleReply.push({
        step: 1,
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    }, event.messageID);
  }
};
