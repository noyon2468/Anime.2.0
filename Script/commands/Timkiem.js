module.exports.config = {
  name: "search",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Google, YouTube, Bing, DuckDuckGo সার্চ",
  commandCategory: "info",
  usages: "search [google|yt|bing|duck] [query] / reply photo",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { type, messageReply, threadID, messageID } = event;

  if (type === "message_reply" && messageReply.attachments.length > 0) {
    const img = messageReply.attachments[0];
    if (img.type !== "photo") return api.sendMessage("⚠️ শুধু ছবিতে রিপ্লাই দিলে ইমেজ সার্চ করা যাবে!", threadID, messageID);
    const reverseUrl = `https://www.google.com/searchbyimage?&image_url=${img.url}`;
    return api.sendMessage(`🖼️ Google Reverse Image Search লিংক:\n${reverseUrl}`, threadID, messageID);
  }

  const keyword = args.join(" ");
  if (!keyword) return api.sendMessage("🔍 সার্চ করতে কিছু লিখুন!\n\n📌 উদাহরণ:\nsearch google ChatGPT\nsearch yt islami gaan", threadID, messageID);

  const engine = args[0].toLowerCase();
  const query = args.slice(1).join(" ");

  let link = "";

  switch (engine) {
    case "google":
    case "g":
      link = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
    case "yt":
    case "youtube":
      link = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      break;
    case "bing":
      link = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      break;
    case "duck":
    case "ddg":
      link = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      break;
    default:
      link = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
      return api.sendMessage(`🔍 Google সার্চ লিংক:\n${link}`, threadID, messageID);
  }

  const engineName = {
    google: "🌐 Google",
    g: "🌐 Google",
    yt: "📺 YouTube",
    youtube: "📺 YouTube",
    bing: "🟦 Bing",
    duck: "🦆 DuckDuckGo",
    ddg: "🦆 DuckDuckGo"
  };

  return api.sendMessage(`🔍 ${engineName[engine] || "Search"} রেজাল্ট:\n${link}`, threadID, messageID);
};
