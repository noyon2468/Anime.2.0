const axios = require("axios"); const fs = require("fs-extra"); const path = require("path");

const cacheFolder = path.join(__dirname, "cache"); if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

let lastSearches = {}; // per-thread cache

module.exports.config = { name: "pic", version: "2.0.0", hasPermssion: 0, credits: "Shaon Ahmed + Modified by Nur Muhammad & ChatGPT", description: "Search & fetch unlimited images with smart commands", commandCategory: "Search", usages: "pic [query]-[count] | /next | /refresh | /random", cooldowns: 2 };

module.exports.run = async function ({ api, event, args }) { const { threadID, messageID, senderID } = event; const input = args.join(" "); const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json'); const Shaon = apis.data.noobs;

if (input === "/next" && lastSearches[threadID]) { return module.exports.run({ api, event, args: [${lastSearches[threadID].query}-${lastSearches[threadID].nextCount}] }); }

if (input === "/refresh" && lastSearches[threadID]) { return module.exports.run({ api, event, args: [${lastSearches[threadID].query}-${lastSearches[threadID].lastCount}] }); }

if (input === "/random") { const topics = ["anime", "nature", "sky", "art", "love", "girl", "boy", "aesthetic", "wallpaper"]; const randomTopic = topics[Math.floor(Math.random() * topics.length)]; return module.exports.run({ api, event, args: [${randomTopic}-5] }); }

if (!input.includes("-")) { return api.sendMessage('❌ উদাহরণ: pic cat-5', threadID, messageID); }

const keySearchs = input.substr(0, input.indexOf('-')).trim(); const numberSearch = parseInt(input.split("-").pop()) || 6;

try { const res = await axios.get(${Shaon}/pinterest?search=${encodeURIComponent(keySearchs)}); const data = res.data.data; if (!data || data.length === 0) return api.sendMessage("❌ কিছুই পাওয়া যায়নি!", threadID, messageID);

const imgData = [];
for (let i = 0; i < numberSearch && i < data.length; i++) {
  const imgPath = path.join(cacheFolder, `${threadID}_${i}.jpg`);
  const response = await axios.get(data[i], { responseType: 'arraybuffer' });
  fs.writeFileSync(imgPath, Buffer.from(response.data));
  imgData.push(fs.createReadStream(imgPath));
}

// Store search history
lastSearches[threadID] = {
  query: keySearchs,
  lastCount: numberSearch,
  nextCount: numberSearch + 3 // next time fetch 3 more
};

const msg = {
  body: `📸 ${numberSearch} টি ছবি:

🔎 কীওয়ার্ড: ${keySearchs}

📥 /next | পরবর্তী ছবি 🔄 /refresh | আবার খোঁজো 🎲 /random | র‌্যান্ডম টপিক`, attachment: imgData };

return api.sendMessage(msg, threadID, () => {
  // Delete cache
  for (let i = 0; i < numberSearch; i++) {
    const filePath = path.join(cacheFolder, `${threadID}_${i}.jpg`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}, messageID);

} catch (err) { console.error(err); return api.sendMessage("❌ Error fetching images.", threadID, messageID); } };

