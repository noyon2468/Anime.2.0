const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "ai",
  version: "1.1.0",
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "Gemini AI দ্বারা প্রশ্নের উত্তর দিন (ছবি সহ প্রশ্নও সাপোর্ট করে)",
  commandCategory: "ai-chat",
  usages: "[প্রশ্ন বা reply সহ]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply, senderID } = event;
  const prompt = args.join(" ") || (messageReply && messageReply.body);

  if (!prompt) return api.sendMessage("❌ দয়া করে প্রশ্ন লিখুন বা কোনো মেসেজে reply করুন।", threadID, messageID);

  // টাইপিং ইফেক্ট
  api.sendTypingIndicator(threadID, true);

  try {
    const hasImage = messageReply?.attachments?.[0]?.type === "photo";
    let imageUrl;

    if (hasImage) {
      const photoStream = messageReply.attachments[0].url;
      imageUrl = photoStream;
    }

    const body = hasImage
      ? {
          modelType: "text_and_image",
          prompt,
          imageParts: [imageUrl]
        }
      : {
          modelType: "text_only",
          prompt
        };

    const res = await axios.post("https://gemini-ai-with-gemini-api-minipro-3r.vercel.app/google", body);
    const result = res.data?.result;

    if (!result) throw new Error("Gemini কোনো উত্তর দেয়নি!");

    let msg = `👤 প্রশ্নকারী: fb.com/${senderID}\n📩 উত্তর:\n${result}`;

    return api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    console.log("❌ Gemini API error:", err);
    return api.sendMessage("😥 দুঃখিত, Gemini থেকে উত্তর আনতে সমস্যা হচ্ছে।", threadID, messageID);
  }
};
