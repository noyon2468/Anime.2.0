const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = "ArYANAHMEDRUDRO";

module.exports = {
  config: {
    name: "4k",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "নূর মোহাম্মদ + CYBER ☢️ TEAM × Aryan",
    description: "🎨 Enhance, cartoon, blur, or remove background from any image",
    commandCategory: "Image Editing",
    usages: "Reply to an image or send a URL\n\n4k [upscale|cartoon|blur|removebg]",
    cooldowns: 5
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, messageReply, senderID } = event;
    const option = (args[0] || "upscale").toLowerCase();
    const imageUrl = messageReply?.attachments?.[0]?.url || args[1];

    if (!imageUrl) {
      return api.sendMessage(
        "⚠️ অনুগ্রহ করে একটি ছবিতে রিপ্লাই দাও অথবা ইমেজ URL দাও।\n\n🔧 Example: 4k cartoon",
        threadID, messageID
      );
    }

    const supportedOptions = ["upscale", "cartoon", "blur", "removebg"];
    if (!supportedOptions.includes(option)) {
      return api.sendMessage(`❌ Invalid option.\n\n✅ Available options: ${supportedOptions.join(", ")}`, threadID, messageID);
    }

    let apiUrl, processingText;
    switch (option) {
      case "cartoon":
        apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/cartoon?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${apiKey}`;
        processingText = "🎨 Cartoonizing image...";
        break;
      case "blur":
        apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/blur?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${apiKey}`;
        processingText = "💫 Adding blur effect...";
        break;
      case "removebg":
        apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/removebg?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${apiKey}`;
        processingText = "🚫 Removing background...";
        break;
      default:
        apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${apiKey}`;
        processingText = "📈 Upscaling to 4K...";
        break;
    }

    const filePath = path.join(__dirname, "cache", `${Date.now()}_${option}.jpg`);

    try {
      const waiting = await api.sendMessage(processingText, threadID);

      const res = await axios.get(apiUrl);
      const finalImageURL = res?.data?.resultImageUrl;
      if (!finalImageURL) throw new Error("No image returned.");

      const imgBuffer = (await axios.get(finalImageURL, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(filePath, imgBuffer);

      api.sendMessage({
        body: "✅ Image processed successfully!",
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);

      api.unsendMessage(waiting.messageID);
    } catch (err) {
      console.error("4k Error:", err);
      api.sendMessage("❌ Image process failed. Try again later.", threadID, messageID);
    }
  }
};
