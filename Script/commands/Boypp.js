module.exports = {
  config: {
    name: "pin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "নূর মোহাম্মদ",
    description: "Pinterest থেকে ইমেজ সার্চ করে দেখায়",
    commandCategory: "image",
    usages: "pin [boy|girl|couple|quran|sunnah|<custom>]",
    cooldowns: 3
  },

  run: async ({ api, event, args }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");

    if (!args[0]) {
      return api.sendMessage(
        `🔍 আপনি কী ছবি চান?\n\nউদাহরণ:\n• pin boy\n• pin girl\n• pin couple\n• pin quran\n• pin sunnah\n\n✍️ নিজের keyword দিলেও কাজ করবে।`,
        event.threadID,
        event.messageID
      );
    }

    const query = args.join(" ");
    const encodedQuery = encodeURIComponent(query);

    const url = `https://nur-api.vercel.app/pinterest?search=${encodedQuery}`;

    try {
      const res = await axios.get(url);
      if (!res.data || !res.data.status || !res.data.image) {
        return api.sendMessage("😔 ছবি পাওয়া যায়নি। আবার চেষ্টা করুন।", event.threadID, event.messageID);
      }

      const img = res.data.image;
      const path = __dirname + `/cache/pin.jpg`;

      request(img).pipe(fs.createWriteStream(path)).on("close", () => {
        api.sendMessage({
          body: `📌 Pinterest Image for: "${query}"\n❤️ Powered by নূর মোহাম্মদ`,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।", event.threadID, event.messageID);
    }
  }
};
