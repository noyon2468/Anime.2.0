const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "anime",
  version: "9.3.1",
  hasPermssion: 0,
  credits: "Nur Muhammad + ChatGPT",
  description: "Anime info, manga, waifu, neko, quote, quiz, score, daily, list, top, airing, random, gif, suggest, wallpaper, search, etc.",
  commandCategory: "fun",
  usages: "[help|info|manga|waifu|neko|quote|quiz|score|daily|list|top|airing|random|gif|suggest|wallpaper|voice|song|search] <name>",
  cooldowns: 3,
};

let sessionToken = null;
const leaderboard = {};

async function getTriviaToken() {
  if (!sessionToken) {
    const res = await axios.get('https://opentdb.com/api_token.php?command=request');
    sessionToken = res.data.token;
  }
}

async function fetchAnimeQuiz() {
  await getTriviaToken();
  const res = await axios.get(`https://opentdb.com/api.php?amount=1&category=31&type=multiple&encode=url3986&token=${sessionToken}`);
  if (res.data.response_code === 3) {
    sessionToken = null;
    return fetchAnimeQuiz();
  }
  const q = res.data.results[0];
  if (!q) throw new Error("No quiz found");
  const allAnswers = [...q.incorrect_answers, q.correct_answer];
  const shuffled = allAnswers.sort(() => 0.5 - Math.random());
  return {
    question: decodeURIComponent(q.question),
    options: shuffled.map((ans, i) => `${String.fromCharCode(65 + i)}. ${decodeURIComponent(ans)}`),
    correct: String.fromCharCode(65 + shuffled.indexOf(q.correct_answer))
  };
}

async function fetchAnimeQuote() {
  const res = await axios.get('https://animechan.xyz/api/random');
  const q = res.data;
  return `${q.quote}\n— ${q.character} (${q.anime})`;
}

function sendImage(api, threadID, url, message) {
  const cachePath = `${__dirname}/cache/anime_${Date.now()}.jpg`;
  request(encodeURI(url))
    .pipe(fs.createWriteStream(cachePath))
    .on("close", () => {
      api.sendMessage({ body: message, attachment: fs.createReadStream(cachePath) }, threadID, () => fs.unlinkSync(cachePath));
    });
}

function sendQuiz(api, threadID, senderID, q) {
  api.sendMessage(
    `🧠 Anime কুইজঃ\n${q.question}\n\n${q.options.join("\n")}\n\n📩 উত্তর দিন: A/B/C/D`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        correct: q.correct,
        author: senderID,
        type: "quiz"
      });
    }
  );
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;
  const modeList = ["help", "info", "manga", "waifu", "neko", "quote", "quiz", "score", "daily", "list", "top", "airing", "random", "gif", "suggest", "wallpaper", "voice", "song", "search"];

  if (args.length === 0 || args[0].toLowerCase() === "help") {
    return api.sendMessage(
      `📚 Anime Bot Menu:\n━━━━━━━━━━━━━━━\n🔎 info: anime info Naruto\n📚 manga: anime manga OnePiece\n💞 waifu/neko: anime waifu\n📜 quote: anime quote\n🧠 quiz: anime quiz\n📈 score: anime score\n📅 daily: anime daily\n📋 list: anime list death\n🏆 top: anime top\n📺 airing: anime airing\n🎲 random: anime random\n🎞️ gif: anime gif naruto\n🎧 song: anime song bleach\n🎤 voice: anime voice itachi\n🖼️ wallpaper: anime wallpaper gojo\n🌟 suggest: anime suggest\n🔍 search: anime search tokyo\n━━━━━━━━━━━━━━━`,
      threadID
    );
  }

  let mode = "info";
  let query = args.join(" ");
  if (modeList.includes(args[0].toLowerCase())) {
    mode = args[0].toLowerCase();
    query = args.slice(1).join(" ");
  }

  try {
    if (["waifu", "neko"].includes(mode)) {
      const res = await axios.get(`https://api.waifu.pics/sfw/${mode}`);
      return sendImage(api, threadID, res.data.url, `💖 Here's your ${mode.toUpperCase()}!`);
    }

    if (mode === "quote") {
      const quote = await fetchAnimeQuote();
      return api.sendMessage(`📜 Anime Quote:\n\n${quote}`, threadID);
    }

    if (mode === "quiz") {
      const q = await fetchAnimeQuiz();
      return sendQuiz(api, threadID, senderID, q);
    }

    if (mode === "score") {
      const entries = Object.entries(leaderboard);
      if (!entries.length) return api.sendMessage("📊 এখনও কেউ কুইজ খেলেনি!", threadID);
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      const top = sorted.slice(0, 5).map(([uid, score], i) => `${i + 1}. ${uid} — ${score} pts`).join("\n");
      return api.sendMessage(`🏆 Quiz Leaderboard:\n\n${top}`, threadID);
    }

    if (mode === "daily") {
      const day = new Date().toISOString().slice(0, 10);
      const hash = [...day].reduce((sum, c) => sum + c.charCodeAt(0), 0);
      const res = await axios.get(`https://api.jikan.moe/v4/anime?limit=50`);
      const pick = res.data.data[hash % res.data.data.length];
      return sendImage(api, threadID, pick.images.jpg.large_image_url,
        `📅 আজকের এনিমে সুপারিশ:\n📺 নাম: ${pick.title}\n⭐ রেটিং: ${pick.score}\n🎬 পর্ব: ${pick.episodes}\n📌 অবস্থা: ${pick.status}\n\n📝 ${pick.synopsis?.slice(0, 500)}`);
    }

    if (mode === "gif") {
      const res = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${encodeURIComponent(query || "wave")}`);
      const gifURL = res.data.url || res.data.gif || res.data.result;
      if (!gifURL) return api.sendMessage("❌ GIF পাওয়া যায়নি!", threadID);
      return sendImage(api, threadID, gifURL, `🎞️ Anime GIF: ${query}`);
    }

    if (mode === "suggest") {
      const genre = ["action", "drama", "romance", "comedy", "sports", "fantasy"];
      const pick = genre[Math.floor(Math.random() * genre.length)];
      const res = await axios.get(`https://api.jikan.moe/v4/anime?genres=${pick}&limit=1`);
      const s = res.data.data[0];
      return sendImage(api, threadID, s.images.jpg.large_image_url,
        `🌟 Genre: ${pick}\n📺 ${s.title}\n📝 ${s.synopsis?.substring(0, 400)}`);
    }

    if (mode === "wallpaper") {
      if (!query) return api.sendMessage("📌 দয়া করে একটি এনিমে ক্যারেক্টারের নাম দিন। যেমনঃ anime wallpaper gojo", threadID);
      const res = await axios.get(`https://api.waifu.im/search/?included_tags=${encodeURIComponent(query)}&many=true`);
      const results = res.data.images;
      if (!results.length) return api.sendMessage("❌ কোনো ওয়ালপেপার খুঁজে পাওয়া যায়নি!", threadID);
      const pick = results[Math.floor(Math.random() * results.length)];
      return sendImage(api, threadID, pick.url, `🖼️ ${query.toUpperCase()} এর ওয়ালপেপার!`);
    }

    if (mode === "voice") return api.sendMessage("🎤 Voice feature coming soon with character voices!", threadID);
    if (mode === "song") return api.sendMessage("🎧 Anime Song feature will include opening/ending info soon!", threadID);

    if (mode === "manga") {
      const search = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
      const manga = search.data.data[0];
      if (!manga) return api.sendMessage("❌ কোনো manga পাওয়া যায়নি!", threadID);
      const msg = `📚 Manga: ${manga.title}\n📊 Score: ${manga.score}\n📌 Status: ${manga.status}\n📝 Summary: ${manga.synopsis?.substring(0, 500) || "N/A"}`;
      return sendImage(api, threadID, manga.images.jpg.large_image_url, msg);
    }

    if (mode === "list") {
      const search = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
      const titles = search.data.data.map((a, i) => `${i + 1}. ${a.title} (${a.type})`);
      return api.sendMessage(`🔍 Anime List:\n\n${titles.join("\n")}`, threadID);
    }

    if (mode === "top") {
      const top = await axios.get(`https://api.jikan.moe/v4/top/anime?limit=5`);
      const topList = top.data.data.map((a, i) => `${i + 1}. ${a.title} ⭐(${a.score})`);
      return api.sendMessage(`🏆 Top Anime List:\n\n${topList.join("\n")}`, threadID);
    }

    if (mode === "airing") {
      const airing = await axios.get(`https://api.jikan.moe/v4/seasons/now`);
      const airingList = airing.data.data.slice(0, 5).map((a, i) => `${i + 1}. ${a.title} (${a.type})`);
      return api.sendMessage(`📺 বর্তমানে প্রচারিত টপ এনিমে:\n\n${airingList.join("\n")}`, threadID);
    }

    if (mode === "random") {
      const rand = await axios.get(`https://api.jikan.moe/v4/random/anime`);
      const { title, synopsis, score, episodes, status, images } = rand.data.data;
      return sendImage(api, threadID, images.jpg.large_image_url,
        `🎲 র‍্যান্ডম Anime: ${title}\n📊 Rating: ${score}\n🎬 পর্ব: ${episodes}\n📌 অবস্থা: ${status}\n\n📝 ${synopsis}`);
    }

    if (mode === "search") {
      if (!query) return api.sendMessage("🔍 দয়া করে একটি anime এর নাম লিখুন, যেমন: anime search demon slayer", threadID);
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
      const list = res.data.data;
      if (!list.length) return api.sendMessage("❌ কোনো Anime খুঁজে পাওয়া যায়নি!", threadID);
      const results = list.map((anime, i) =>
        `${i + 1}. 📺 ${anime.title}\n🎬 পর্ব: ${anime.episodes || "N/A"}\n⭐ রেটিং: ${anime.score || "N/A"}\n📌 অবস্থা: ${anime.status}\n`
      ).join("\n");
      return api.sendMessage(`🔍 Search Result for: ${query}\n\n${results}`, threadID);
    }

    const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
    const data = res.data.data[0];
    if (!data) return api.sendMessage("❌ Anime খুঁজে পাওয়া যায়নি!", threadID);
    const { title, synopsis, score, episodes, status, images } = data;
    return sendImage(api, threadID, images.jpg.large_image_url,
      `📺 শিরোনাম: ${title}\n🎬 পর্ব: ${episodes}\n📊 রেটিং: ${score}\n📌 অবস্থা: ${status}\n\n📝 সারসংক্ষেপ:\n${synopsis}`);
  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ Anime বা manga খুঁজতে সমস্যা হয়েছে।", threadID);
  }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  const { type, correct, author } = handleReply;
  if (type === "quiz") {
    if (event.senderID !== author) return;
    const ans = event.body.trim().toUpperCase();
    if (ans === correct) {
      leaderboard[author] = (leaderboard[author] || 0) + 1;
      api.sendMessage(`✅ সঠিক! 🎉\n📈 স্কোর: ${leaderboard[author]}\n\n📥 পরবর্তী কুইজ আসছে...`, event.threadID, async () => {
        const q = await fetchAnimeQuiz();
        sendQuiz(api, event.threadID, author, q);
      });
    } else {
      return api.sendMessage(`❌ ভুল উত্তর! সঠিক উত্তর: ${correct}`, event.threadID);
    }
  }
};
