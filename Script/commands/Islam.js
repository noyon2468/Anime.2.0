/** ইসলামিক ভালোবাসা ❤️, দয়া করে কপি করে নিজের বলে চালিয়ো না 🙂 **/
module.exports.config = {
  name: "islam",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "আল্লাহ্‌র কথা স্মরণ করো 🕌 ইসলামিক ভিডিও",
  commandCategory: "islamic",
  usages: "islam",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const greetings = [
    "🌙 আসসালামু আলাইকুম ওয়া রহমাতুল্লাহি ওয়া বারাকাতুহ 🌸\n\n📿 প্রিয় ভাই ও বোন, আপনার জন্য আজকের একটি ইসলামিক ভিডিও পাঠানো হলো ❤️\n\n🤍 ইসলাম প্রচারে এগিয়ে আসুন ✨"
  ];
  const message = greetings[Math.floor(Math.random() * greetings.length)];

  const link = [
    "https://drive.google.com/uc?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH",
    "https://drive.google.com/uc?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O",
    "https://drive.google.com/uc?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW",
    "https://drive.google.com/uc?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD",
    "https://drive.google.com/uc?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4",
    "https://drive.google.com/uc?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD",
    "https://drive.google.com/uc?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA",
    "https://drive.google.com/uc?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441",
    "https://drive.google.com/uc?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8",
    "https://drive.google.com/uc?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo",
    "https://drive.google.com/uc?id=1ZR7svrEvfvdr_S9wzAfIEbIAsYkYhTYz",
    "https://drive.google.com/uc?id=1ZQksc2uA3Q23FO6qJ6zOZ9Zg-WMi0n8v",
    "https://drive.google.com/uc?id=1ZOPuP4Swv99h2T1L8n6CRq6p9TQlKMv2",
    "https://drive.google.com/uc?id=1ZLQv8glAhy_GjRQo4eq1SccGbUuKoTnP",
    "https://drive.google.com/uc?id=1ZKcR7jTwFx7HzEp3ePf3A57YBgRMSMH1",
    "https://drive.google.com/uc?id=1ZHmW-ylkzEo3MPNs3JQa4HnJKd7yb54G",
    "https://drive.google.com/uc?id=1ZFypZAgcL0MKj_3ZueX_Wx3U4LQGxhnv",
    "https://drive.google.com/uc?id=1ZCsypRsCZDXKOXJqa0c3sxOAkLJ5Dv8A",
    "https://drive.google.com/uc?id=1ZBDFU8WS7zRuB2Oekj2RL53Xv8GzIHPz",
    "https://drive.google.com/uc?id=1Z_AJ43YXRMU1T-uXXPkWqZhMR15WgIoB",
    "https://drive.google.com/uc?id=1Y_nElN9u6PVEiG1g9LRtFoyvPVRGw5iT",
    "https://drive.google.com/uc?id=1Y_WY9gyWX6YBS3g3V0w1BYuUjZWeoACd",
    "https://drive.google.com/uc?id=1YVEZKQTuZr0KvwnHQUZAYMbXzjhk13OH",
    "https://drive.google.com/uc?id=1YTNxbyz_R8rUGfQonrU1Zl5MUPngdMxu",
    "https://drive.google.com/uc?id=1YTkYv2CCz5QLV7DYOlw0xP0PZzvKaBuX"
  ];

  const file = __dirname + "/cache/islamic.mp4";
  const videoUrl = encodeURI(link[Math.floor(Math.random() * link.length)]);
  
  const callback = () => {
    api.sendMessage(
      { body: message, attachment: fs.createReadStream(file) },
      event.threadID,
      () => fs.unlinkSync(file)
    );
  };

  return request(videoUrl)
    .pipe(fs.createWriteStream(file))
    .on("close", () => callback());
};
