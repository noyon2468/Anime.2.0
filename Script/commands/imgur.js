module.exports.config = {
  name: "imgur",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Convert image to Imgur link",
  commandCategory: "tools",
  usages: "[reply image]",
  cooldowns: 2
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");

  const getAPI = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
  const baseUrl = getAPI.data.imgur;

  let imageURL;

  // Check if replied with image
  if (event.messageReply && event.messageReply.attachments.length > 0) {
    imageURL = event.messageReply.attachments[0].url;
  } else if (args[0]) {
    imageURL = args.join(" ");
  }

  if (!imageURL) {
    return api.sendMessage(
      `╭•┄┅══❁🌺❁══┅┄•╮\n\nআসসালামু আলাইকুম 🖤💫\nImgur লিংক বানাতে একটি ছবি রিপ্লাই করুন অথবা লিংক দিন।\n\nUsage: imgur [reply image/link]\n\n╰•┄┅══❁🌺❁══┅┄•╯`,
      event.threadID, event.messageID
    );
  }

  try {
    const res = await axios.get(`${baseUrl}/imgur?link=${encodeURIComponent(imageURL)}`);
    const imgLink = res.data.uploaded.image;

    return api.sendMessage(`✅ আপনার Imgur লিংক তৈরি হয়েছে:\n${imgLink}`, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage("❌ লিংক তৈরি করা যায়নি, আবার চেষ্টা করুন!", event.threadID, event.messageID);
  }
};
