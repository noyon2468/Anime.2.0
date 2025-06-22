const axios = require("axios");

const apiURL = "https://smfahim.xyz/gedit";

module.exports.config = {
  name: "refine",
  version: "7.0",
  credits: "Fahim API × Customized by নূর মোহাম্মদ",
  hasPermssion: 0,
  commandCategory: "image edit",
  description: "AI edit your photo with custom style prompt",
  usages: "reply image + /refine [prompt]",
  cooldowns: 5,
};

async function handleEdit(api, event, args) {
  const url = event.messageReply?.attachments?.[0]?.url;
  const prompt = args.join(" ") || "professional studio portrait";

  if (!url) {
    return api.sendMessage("❌ একটি ছবিতে reply দিন।", event.threadID, event.messageID);
  }

  try {
    const response = await axios.get(
      `${apiURL}?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(url)}`,
      { responseType: "stream", validateStatus: () => true }
    );

    if (response.headers["content-type"]?.startsWith("image/")) {
      return api.sendMessage(
        { body: `✅ Refined with prompt: ${prompt}`, attachment: response.data },
        event.threadID,
        event.messageID
      );
    }

    let result = "";
    for await (const chunk of response.data) result += chunk.toString();

    const json = JSON.parse(result);
    if (json?.response) {
      return api.sendMessage(`⚠️ ${json.response}`, event.threadID, event.messageID);
    }

    return api.sendMessage("❌ কোনো ছবি বা রেসপন্স পাওয়া যায়নি।", event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ refine error:", err.message);
    return api.sendMessage("🚫 API থেকে ছবি আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
}

module.exports.run = async function ({ api, event, args }) {
  if (!event.messageReply || !event.messageReply.attachments?.length) {
    return api.sendMessage("❌ একটি ছবিতে reply করে refine দিন।", event.threadID, event.messageID);
  }

  await handleEdit(api, event, args);
};

module.exports.handleReply = async function ({ api, event, args }) {
  if (event.type === "message_reply") {
    await handleEdit(api, event, args);
  }
};
