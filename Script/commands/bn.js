module.exports.config = {
  name: "bn",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  usePrefix: false,
  description: "Text translation to any language",
  commandCategory: "media",
  usages: "[lang_code] -> [Text]\n\nExamples:\n/bn en -> আমি তোমাকে ভালোবাসি\n/bn hi -> I love you",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  const input = args.join(" ");

  if (!input && event.type != "message_reply") {
    return api.sendMessage("❌ অনুবাদ করার জন্য কিছু লিখুন অথবা কোন মেসেজ রিপ্লাই করুন।", event.threadID, event.messageID);
  }

  let lang = global.config.language || "bn"; // fallback language
  let translateThis = input;

  if (input.includes("->")) {
    const parts = input.split("->");
    lang = parts[0].trim().split(" ").pop(); // get lang code
    translateThis = parts.slice(1).join("->").trim(); // get text
  }

  if (event.type == "message_reply" && !translateThis) {
    translateThis = event.messageReply.body;
  }

  return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
    if (err) return api.sendMessage("❌ অনুবাদ করতে সমস্যা হচ্ছে!", event.threadID, event.messageID);

    try {
      const retrieve = JSON.parse(body);
      let translated = '';
      retrieve[0].forEach(item => (item[0]) ? translated += item[0] : '');
      const fromLang = retrieve[2] || retrieve[8]?.[0]?.[0] || "auto";

      return api.sendMessage(`📤 Source: ${fromLang.toUpperCase()}\n📥 Translated to: ${lang.toUpperCase()}\n\n${translated}`, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("⚠️ অনুবাদ ফর্ম্যাট বুঝা যায়নি।", event.threadID, event.messageID);
    }
  });
};
