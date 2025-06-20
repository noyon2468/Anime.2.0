const axios = require("axios");
const fs = require('fs');
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports.config = {
  name: "song",
  version: "2.2.0",
  aliases: ["music", "play"],
  credits: "Dipto + ChatGPT Fix Bangla",
  countDown: 5,
  hasPermssion: 0,
  description: "Download YouTube audio by song name or link",
  commandCategory: "media",
  usages: "{pn} <song name or YouTube link>",
};

module.exports.run = async ({ api, args, event }) => {
  const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  let videoID;
  const urlYtb = checkurl.test(args[0]);

  if (urlYtb) {
    const match = args[0].match(checkurl);
    videoID = match ? match[1] : null;
    const { data: { title, downloadLink } } = await axios.get(
      `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
    );
    return api.sendMessage({
      body: title,
      attachment: await downloadFile(downloadLink, 'audio.mp3')
    }, event.threadID, () => fs.unlinkSync('audio.mp3'), event.messageID);
  }

  let keyWord = args.join(" ");
  if (!keyWord) return api.sendMessage("🔍 গান খুঁজতে একটি নাম দিন।", event.threadID, event.messageID);
  keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
  const encodedKey = encodeURIComponent(keyWord);

  let result;
  try {
    result = ((await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodedKey}`)).data).slice(0, 6);
  } catch (err) {
    return api.sendMessage("❌ সার্চে সমস্যা হয়েছে:\n" + err.message, event.threadID, event.messageID);
  }

  if (result.length === 0) return api.sendMessage("🔍 কোনো গান পাওয়া যায়নি:\n" + keyWord, event.threadID, event.messageID);

  let msg = "", i = 1;
  const thumbs = [];
  for (const info of result) {
    thumbs.push(downloadStream(info.thumbnail, `thumb${i}.jpg`));
    msg += `${i++}. ${info.title}\n🕒 ${info.time}\n📺 ${info.channel.name}\n\n`;
  }

  api.sendMessage({
    body: msg + "➡️ উপরের যেকোনো নাম্বার রিপ্লাই দিন গান ডাউনলোড করতে",
    attachment: await Promise.all(thumbs)
  }, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      result
    });
  }, event.messageID);
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  try {
    const { result } = handleReply;
    const choice = parseInt(event.body);
    if (!isNaN(choice) && choice <= result.length && choice > 0) {
      const info = result[choice - 1];
      const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${info.id}&format=mp3`);
      await api.unsendMessage(handleReply.messageID);
      return api.sendMessage({
        body: `🎵 ${title}\n🎧 Quality: ${quality}`,
        attachment: await downloadFile(downloadLink, 'audio.mp3')
      }, event.threadID, () => fs.unlinkSync('audio.mp3'), event.messageID);
    } else {
      return api.sendMessage("❌ সঠিক নাম্বার দিন (১-৬)।", event.threadID, event.messageID);
    }
  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ গান ডাউনলোড করতে সমস্যা হয়েছে।\n❗ সম্ভবত ফাইলটি 26MB এর বেশি।", event.threadID, event.messageID);
  }
};

async function downloadFile(url, pathName) {
  try {
    const res = (await axios.get(url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathName, Buffer.from(res));
    return fs.createReadStream(pathName);
  } catch (err) {
    throw err;
  }
}

async function downloadStream(url, pathName) {
  try {
    const res = await axios.get(url, { responseType: "stream" });
    res.data.path = pathName;
    return res.data;
  } catch (err) {
    throw err;
  }
}
