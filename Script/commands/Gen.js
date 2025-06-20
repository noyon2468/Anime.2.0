const axios = require("axios"); const fs = require("fs-extra"); const path = require("path");

module.exports.config = { name: "gen", version: "2.1", hasPermssion: 0, credits: "নূর মোহাম্মদ + Islamic Chat Bot", description: "🔮 AI Flux Image Generator using prompt", commandCategory: "ai-photo", usages: "[prompt] --ratio 1024x1024 (optional)", cooldowns: 10, };

module.exports.run = async ({ event, args, api }) => { try { const fullPrompt = args.join(" "); const [prompt, ratioInput] = fullPrompt.includes("--ratio") ? fullPrompt.split("--ratio").map(x => x.trim()) : [fullPrompt, ""];

if (!prompt) {
  return api.sendMessage(
    "📌 উদাহরণ:\n`gen beautiful sunset on mountains --ratio 1024x1024`",
    event.threadID, event.messageID
  );
}

const waiting = await api.sendMessage("🧠 AI ছবিটি তৈরী করছে, একটু অপেক্ষা করুন...", event.threadID);
api.setMessageReaction("⏳", event.messageID, () => {}, true);

const fluxURL = `https://dall-e-tau-steel.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`;
const res = await axios.get(fluxURL);
const imageURL = res.data.response;

if (!imageURL) {
  return api.sendMessage("❌ ছবির লিংক API থেকে পাওয়া যায়নি।", event.threadID, event.messageID);
}

const imageRes = await axios.get(imageURL, { responseType: "arraybuffer" });
const imgPath = path.join(__dirname, "cache", `flux_${Date.now()}.jpg`);
await fs.outputFile(imgPath, imageRes.data);

await api.sendMessage({
  body: `✅ আপনার AI ছবি প্রস্তুত 🎨\n📌 Prompt: ${prompt}${ratioInput ? `\n📀 Ratio: ${ratioInput}` : ""}`,
  attachment: fs.createReadStream(imgPath)
}, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

api.setMessageReaction("✅", event.messageID, () => {}, true);
api.unsendMessage(waiting.messageID);

} catch (err) { console.error("❌ Flux AI Error:", err); return api.sendMessage("❌ Flux AI Image Generator তে সমস্যা হয়েছে:\n" + err.message, event.threadID, event.messageID); } };

