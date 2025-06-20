const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

const API_BASE = "https://smfahim.xyz/gedit";

module.exports.config = {
  name: "refine",
  version: "7.0.1",
  credits: "Nur Muhammad + ChatGPT",
  hasPermssion: 0,
  commandCategory: "ai-photo",
  description: "AI দিয়ে আনলিমিটেড ছবি এডিট করুন",
  usages: "reply to image + refine [cartoon/blur/smooth/bgremove/hd/custom]",
  cooldowns: 0,
};

const presets = {
  cartoon: "Make me a cartoon character",
  smooth: "Smooth face and enhance clarity",
  blur: "Blur the background softly",
  bgremove: "Remove the background",
  hd: "Make the image 4K HD"
};

module.exports.run = async ({ api, event, args }) => {
  const imageURL = event.messageReply?.attachments?.[0]?.url;
  if (!imageURL) {
    return api.sendMessage("🖼️ অনুগ্রহ করে একটি ছবিতে reply দিন এবং একটি প্রম্পট যুক্ত করুন।", event.threadID, event.messageID);
  }

  const input = args.join(" ").toLowerCase();
  const prompt = presets[input] || input || "Make this photo look better";

  try {
    const res = await axios.get(`${API_BASE}?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageURL)}`, {
      responseType: 'stream',
      validateStatus: () => true
    });

    const contentType = res.headers["content-type"] || "";

    if (contentType.startsWith("image/")) {
      return api.sendMessage({ attachment: res.data }, event.threadID, event.messageID);
    }

    let text = "";
    for await (const chunk of res.data) {
      text += chunk.toString();
    }

    try {
      const json = JSON.parse(text);
      return api.sendMessage(json?.response || "⚠️ ছবি এডিট করা যায়নি। আবার চেষ্টা করুন।", event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage("⚠️ ছবি এডিট করা যায়নি বা রেসপন্স অজানা।", event.threadID, event.messageID);
    }

  } catch (error) {
    console.error("AI Edit Error:", error);
    return api.sendMessage("🚫 ছবি এডিট করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
