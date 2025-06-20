const axios = require("axios");
const fs = require('fs');

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return base.data.api;
};

module.exports = {
  config: {
    name: "youtube",
    version: "1.1.5",
    credits: "Nur Muhammad + ChatGPT",
    countDown: 5,
    hasPermssion: 0,
    description: "ইউটিউব থেকে ভিডিও/অডিও ডাউনলোড করুন",
    commandCategory: "media",
    usePrefix: true,
    prefix: true,
    usages: "youtube -v/-a/-i [লিংক/নাম]",
  },

  run: async ({ api, args, event }) => {
    const { threadID, messageID, senderID } = event;

    if (!args[0])
      return api.sendMessage("❌ অপশন দিন: -v (ভিডিও), -a (অডিও), -i (ইনফো)", threadID, messageID);
    const action = args[0].toLowerCase();

    const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([\w-]{11})/;
    const urlValid = args[1] ? ytRegex.test(args[1]) : false;

    if (urlValid) {
      const format = ['-v', 'video', 'mp4'].includes(action) ? 'mp4'
        : ['-a', 'audio', 'mp3'].includes(action) ? 'mp3' : null;
      if (!format) return api.sendMessage("❌ ভুল ফরম্যাট! -v (ভিডিও), -a (অডিও)", threadID, messageID);

      const match = args[1].match(ytRegex);
      const videoID = match[1];
      const path = `ytb_${format}_${videoID}.${format}`;

      try {
        const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=3`);
        await api.sendMessage({
          body: `🎬 টাইটেল: ${title}\n📥 কোয়ালিটি: ${quality}`,
          attachment: await downloadFile(downloadLink, path)
        }, threadID, () => fs.unlinkSync(path), messageID);
      } catch (err) {
        console.error(err);
        return api.sendMessage("❌ ডাউনলোড করতে সমস্যা হচ্ছে!", threadID, messageID);
      }

      return;
    }

    args.shift();
    const keyword = args.join(" ");
    if (!keyword) return api.sendMessage("❌ সার্চ কীওয়ার্ড দিন!", threadID, messageID);

    try {
      const results = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyword)}`)).data.slice(0, 6);
      if (!results.length) return api.sendMessage(`🔍 কিছুই পাওয়া যায়নি: ${keyword}`, threadID, messageID);

      let msg = "🔎 সার্চ রেজাল্ট:\n\n";
      const thumbs = [];

      for (let i = 0; i < results.length; i++) {
        const vid = results[i];
        msg += `${i + 1}. ${vid.title}\n⏱ সময়: ${vid.time}\n📺 চ্যানেল: ${vid.channel.name}\n\n`;
        thumbs.push(streamImage(vid.thumbnail, `thumb_${i + 1}.jpg`));
      }

      return api.sendMessage({
        body: msg + "👉 নিচের কোনো নাম্বারে রিপ্লাই করুন ডাউনলোডের জন্য!",
        attachment: await Promise.all(thumbs)
      }, threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          result: results,
          action
        });
      }, messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ সার্চ করতে সমস্যা হচ্ছে!", threadID, messageID);
    }
  },

  handleReply: async ({ event, api, handleReply }) => {
    const { threadID, messageID, senderID, body } = event;
    if (senderID !== handleReply.author) return;

    const { result, action } = handleReply;
    const choice = parseInt(body);
    if (isNaN(choice) || choice <= 0 || choice > result.length)
      return api.sendMessage("❌ সঠিক নাম্বার দিন!", threadID, messageID);

    const selected = result[choice - 1];
    const videoID = selected.id;
    const format = ['-v', 'video', 'mp4'].includes(action) ? 'mp4'
      : ['-a', 'audio', 'mp3'].includes(action) ? 'mp3' : null;

    if (format) {
      const path = `ytb_${format}_${videoID}.${format}`;
      try {
        const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=3`);
        await api.sendMessage({
          body: `🎞️ টাইটেল: ${title}\n📥 কোয়ালিটি: ${quality}`,
          attachment: await downloadFile(downloadLink, path)
        }, threadID, () => fs.unlinkSync(path), messageID);
      } catch (e) {
        console.error(e);
        return api.sendMessage('❌ ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন!', threadID, messageID);
      }
    }

    if (action === '-i' || action === 'info') {
      try {
        const { data } = await axios.get(`${await baseApiUrl()}/ytfullinfo?videoID=${videoID}`);
        await api.sendMessage({
          body: `🎬 টাইটেল: ${data.title}\n⏳ সময়: ${(data.duration / 60).toFixed(2)} মিনিট\n📺 রেজুলেশন: ${data.resolution}\n👀 ভিউ: ${data.view_count}\n👍 লাইক: ${data.like_count}\n💬 মন্তব্য: ${data.comment_count}\n📂 বিভাগ: ${data.categories[0]}\n📢 চ্যানেল: ${data.channel}\n🔗 লিংক: ${data.webpage_url}`,
          attachment: await streamImage(data.thumbnail, 'info_thumb.jpg')
        }, threadID, messageID);
      } catch (e) {
        console.error(e);
        return api.sendMessage('❌ ভিডিও ইনফো আনতে সমস্যা হয়েছে!', threadID, messageID);
      }
    }
  }
};

async function downloadFile(url, pathName) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(pathName, Buffer.from(res.data));
  return fs.createReadStream(pathName);
}

async function streamImage(url, pathName) {
  const response = await axios.get(url, { responseType: "stream" });
  response.data.path = pathName;
  return response.data;
}
