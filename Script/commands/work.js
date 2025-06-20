module.exports.config = {
  name: "work",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "নূর মোহাম্মদ + ChatGPT",
  description: "কাজ করে অর্থ উপার্জন করুন!",
  commandCategory: "অর্থনীতি",
  cooldowns: 5,
  envConfig: {
    cooldownTime: 1200000 // 20 মিনিট
  }
};

module.exports.languages = {
  "bn": {
    "cooldown": "আপনি ইতিমধ্যে আজ কাজ করেছেন। বিশ্রাম নিন এবং আবার চেষ্টা করুন: %1 মিনিট %2 সেকেন্ড পর।",
    "rewarded": "✅ আপনি '%1' পেশায় কাজ করে আয় করেছেন 💸 %2 টাকা!",
    "job1": "চা দোকানি",
    "job2": "অ্যাপ ডেভেলপার",
    "job3": "ইলেকট্রিশিয়ান",
    "job4": "ফ্রিল্যান্সার",
    "job5": "ব্লগার",
    "job6": "রং মিস্ত্রি",
    "job7": "ডেলিভারি বয়",
    "job8": "কৃষক",
    "job9": "পাঠ্যবই বিক্রেতা",
    "job10": "ইমাম",
    "job11": "মাঠকর্মী",
    "job12": "দোকানি",
    "job13": "চিত্রশিল্পী",
    "job14": "শিক্ষক",
    "job15": "ওয়েব ডিজাইনার"
  }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
  const { threadID, messageID, senderID } = event;
  const cooldown = global.configModule[this.config.name].cooldownTime;

  let data = (await Currencies.getData(senderID)).data || {};
  if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
    var time = cooldown - (Date.now() - data.workTime),
      minutes = Math.floor(time / 60000),
      seconds = ((time % 60000) / 1000).toFixed(0);

    return api.sendMessage(getText("cooldown", minutes, seconds.padStart(2, '0')), threadID, messageID);
  } else {
    const jobList = [
      getText("job1"), getText("job2"), getText("job3"),
      getText("job4"), getText("job5"), getText("job6"),
      getText("job7"), getText("job8"), getText("job9"),
      getText("job10"), getText("job11"), getText("job12"),
      getText("job13"), getText("job14"), getText("job15")
    ];

    const selectedJob = jobList[Math.floor(Math.random() * jobList.length)];
    const amountEarned = Math.floor(Math.random() * 800) + 100;

    await Currencies.increaseMoney(senderID, amountEarned);
    data.workTime = Date.now();
    await Currencies.setData(senderID, { data });

    return api.sendMessage(getText("rewarded", selectedJob, amountEarned), threadID, messageID);
  }
};
