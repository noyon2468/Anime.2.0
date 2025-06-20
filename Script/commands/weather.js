const request = global.nodemodule["request"];
const moment = global.nodemodule["moment-timezone"];

module.exports.config = {
  name: "weather",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "আপনার লোকেশনের আবহাওয়ার তথ্য দেখায়",
  commandCategory: "🌍 ব্যবহারিক কমান্ড",
  usages: "[শহরের নাম]",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": "",
    "request": ""
  },
  envConfig: {
    "OPEN_WEATHER": "b7f1db5959a1f5b2a079912b03f0cd96"
  }
};

module.exports.run = async ({ api, event, args }) => {
  const city = args.join(" ");
  const { threadID, messageID } = event;

  if (!city) return api.sendMessage("📍 দয়া করে একটি শহরের নাম দিন, যেমন: weather Gazipur", threadID, messageID);

  api.sendMessage("⏳ আবহাওয়ার তথ্য খোঁজা হচ্ছে, একটু অপেক্ষা করুন...", threadID, async (info) => {
    request(encodeURI(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${global.configModule.weather.OPEN_WEATHER}&units=metric&lang=bn`), (err, response, body) => {
      if (err) return api.sendMessage("❌ ত্রুটি ঘটেছে।", threadID, messageID);

      const data = JSON.parse(body);
      if (data.cod !== 200) return api.sendMessage(`❌ শহর খুঁজে পাওয়া যায়নি: "${city}"`, threadID, messageID);

      const sunrise = moment.unix(data.sys.sunrise).tz("Asia/Dhaka").format("hh:mm A");
      const sunset = moment.unix(data.sys.sunset).tz("Asia/Dhaka").format("hh:mm A");
      const temp = data.main.temp;
      const feels = data.main.feels_like;
      const weatherDesc = data.weather[0].description;
      const humidity = data.main.humidity;
      const wind = data.wind.speed;
      const icon = data.weather[0].main.toLowerCase();

      // দিন বা রাত
      const hour = moment().tz("Asia/Dhaka").hour();
      let greeting = "";
      if (hour >= 5 && hour < 12) greeting = "🌄 শুভ সকাল";
      else if (hour >= 12 && hour < 18) greeting = "🌤️ শুভ অপরাহ্ন";
      else if (hour >= 18 && hour < 22) greeting = "🌆 শুভ সন্ধ্যা";
      else greeting = "🌃 শুভ রাত্রি";

      // সতর্কতা বার্তা
      let caution = "";
      if (icon.includes("rain")) caution = "☔ আজ বৃষ্টির সম্ভাবনা আছে, ছাতা নিতে ভুলবেন না!";
      else if (temp >= 35) caution = "🔥 গরম অনেক বেশি, পানি পান করে হাইড্রেটেড থাকুন!";
      else if (temp <= 15) caution = "🧥 আজ ঠান্ডা পড়বে, গরম কাপড় পড়ুন!";

      const msg = `
${greeting}!

📍 শহর: ${data.name}
🌡 তাপমাত্রা: ${temp}°C
🥵 অনুভূত তাপমাত্রা: ${feels}°C
☁️ আবহাওয়া: ${weatherDesc}
💧 আর্দ্রতা: ${humidity}%
💨 বাতাস: ${wind} km/h
🌅 সূর্যোদয়: ${sunrise}
🌄 সূর্যাস্ত: ${sunset}
${caution ? `\n⚠️ ${caution}` : ""}

🤖 তথ্য প্রদান করেছে নূর মোহাম্মদের বট 💫
`.trim();

      api.sendMessage({ body: msg }, threadID, () => {
        api.unsendMessage(info.messageID);
      }, messageID);
    });
  });
};
