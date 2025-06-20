const fs = require("fs-extra");
const path = __dirname + "/cache/teach.json";

module.exports.config = {
  name: "teach",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "বটকে যেকোনো মেসেজের রিপ্লাই শেখাও",
  commandCategory: "system",
  usages: "teach [trigger] => [response]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(" ").split("=>");

  if (input.length < 2)
    return api.sendMessage(
      "📚 ফরম্যাট ভুল!\nসঠিকভাবে শেখাতে লেখো:\nteach কি খবর => ভালো আছি, তুমি কেমন? 🥰",
      threadID, messageID
    );

  const key = input[0].trim().toLowerCase();
  const value = input[1].trim();

  let data = {};
  if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
  data[key] = value;

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  return api.sendMessage(`✅ শেখানো হয়েছে:\n\n🗣️ "${key}" বললে\n🤖 বট বলবে:\n"${value}"`, threadID, messageID);
};
