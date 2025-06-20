module.exports.config = {
  name: "wiki",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "CYBER BOT TEAM + ChatGPT",
  description: "Search topic on Wikipedia with image and summary",
  commandCategory: "study",
  usages: "[en/bn] [topic]",
  cooldowns: 2,
  dependencies: { "wikijs": "" }
};

module.exports.languages = {
  "en": {
    "missingInput": "Please enter a topic to search!",
    "returnNotFound": "❌ No result found for: %1"
  }
};

module.exports.run = async ({ event, args, api, getText }) => {
  const wiki = (global.nodemodule["wikijs"]).default;
  const lang = (args[0] === "bn" || args[0] === "en") ? args.shift() : "en";
  const query = args.join(" ");
  const { threadID, messageID } = event;

  if (!query) return api.sendMessage(getText("missingInput"), threadID, messageID);

  const apiUrl = lang === "bn"
    ? "https://bn.wikipedia.org/w/api.php"
    : "https://en.wikipedia.org/w/api.php";

  try {
    const page = await wiki({ apiUrl }).page(query);
    const summary = await page.summary();
    const url = await page.url();
    const images = await page.images();
    const image = images.find(img => /\.(jpg|jpeg|png)$/i.test(img));

    let msg = `📚 Wikipedia Result (${lang.toUpperCase()})\n\n🔎 Topic: ${query}\n\n📝 ${summary.length > 1800 ? summary.slice(0, 1800) + "..." : summary}\n\n🔗 More Info: ${url}`;

    if (image) {
      const axios = require("axios");
      const fs = require("fs-extra");
      const imgPath = __dirname + "/cache/wiki_img.jpg";
      const imgData = (await axios.get(image, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(imgPath, Buffer.from(imgData, "utf-8"));

      return api.sendMessage(
        { body: msg, attachment: fs.createReadStream(imgPath) },
        threadID,
        () => fs.unlinkSync(imgPath),
        messageID
      );
    } else {
      return api.sendMessage(msg, threadID, messageID);
    }
  } catch (err) {
    return api.sendMessage(getText("returnNotFound", query), threadID, messageID);
  }
};
