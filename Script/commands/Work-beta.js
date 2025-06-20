module.exports.config = {
    name: "job",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "CYBER BOT TEAM + ChatGPT (বাংলা সংস্করণ)",
    description: "চাকরির মাধ্যমে কয়েন ইনকাম করো!",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

module.exports.languages = {
    "bn": {
        "cooldown": "⏳ আবার চেষ্টা করুন %1 মিনিট %2 সেকেন্ড পর।"
    }
};

module.exports.handleReply = async ({ event, api, handleReply, Currencies }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};

    const coins = {
        industry: Math.floor(Math.random() * 401) + 200,
        service: Math.floor(Math.random() * 801) + 200,
        oil: Math.floor(Math.random() * 401) + 200,
        mine: Math.floor(Math.random() * 601) + 200,
        stone: Math.floor(Math.random() * 201) + 200,
        cave: Math.floor(Math.random() * 801) + 200,
    };

    const jobs = {
        industry: ['কর্মচারী নিযুক্ত', 'হোটেল ব্যবস্থাপক', 'বিদ্যুৎ প্ল্যান্টে কাজ', 'রেস্টুরেন্ট শেফ', 'কারখানার শ্রমিক'],
        service: ['প্লাম্বার', 'এসি সারাই', 'বাজারজাতকরণ', 'ফ্লায়ার বিতরণ', 'শিপার', 'কম্পিউটার সারাই', 'গাইড', 'বেবি কেয়ার'],
        oil: ['১৩ ব্যারেল তেল উত্তোলন', '৮ ব্যারেল তেল বিক্রি', 'তেল চুরি', 'জলে তেল মিশিয়ে বিক্রি'],
        mine: ['লোহা', 'সোনা', 'কয়লা', 'সীসা', 'তামা', 'তেলের খনি'],
        stone: ['হীরা', 'সোনা', 'কয়লা', 'পান্না', 'লোহা', 'পাথর', 'সাদামাটা', 'ব্লুস্টোন'],
        cave: ['ভিআইপি অতিথি', 'পেটেন্ট', 'অচেনা লোক', '৯২ বছর বয়সী ধনী', '১২ বছরের গুগলি ছেলে']
    };

    const choice = event.body.trim();
    let msg = "";

    switch (choice) {
        case "1":
            msg = `🏭 আপনি এখন "${jobs.industry[Math.floor(Math.random() * jobs.industry.length)]}" কাজ করে আয় করলেন ${coins.industry}$`;
            Currencies.increaseMoney(senderID, coins.industry);
            break;
        case "2":
            msg = `🧰 আপনি এখন "${jobs.service[Math.floor(Math.random() * jobs.service.length)]}" কাজ করে আয় করলেন ${coins.service}$`;
            Currencies.increaseMoney(senderID, coins.service);
            break;
        case "3":
            msg = `🛢️ আপনি "${jobs.oil[Math.floor(Math.random() * jobs.oil.length)]}" করে পেলেন ${coins.oil}$`;
            Currencies.increaseMoney(senderID, coins.oil);
            break;
        case "4":
            msg = `⛏️ আপনি খনি থেকে "${jobs.mine[Math.floor(Math.random() * jobs.mine.length)]}" তুলে পেলেন ${coins.mine}$`;
            Currencies.increaseMoney(senderID, coins.mine);
            break;
        case "5":
            msg = `🪨 আপনি "${jobs.stone[Math.floor(Math.random() * jobs.stone.length)]}" পাথর খনন করে পেলেন ${coins.stone}$`;
            Currencies.increaseMoney(senderID, coins.stone);
            break;
        case "6":
            msg = `😳 আপনি "${jobs.cave[Math.floor(Math.random() * jobs.cave.length)]}" সিলেক্ট করে পেলেন ${coins.cave}$... বিস্তারিত জানতে 😶`;
            Currencies.increaseMoney(senderID, coins.cave);
            break;
        case "7":
            msg = "🔧 ফিচারটি আপডেট করা হচ্ছে...";
            break;
        default:
            return api.sendMessage("❌ দয়া করে ১-৭ পর্যন্ত সংখ্যা নির্বাচন করুন।", threadID, messageID);
    }

    api.unsendMessage(handleReply.messageID);
    data.work2Time = Date.now();
    await Currencies.setData(senderID, { data });

    return api.sendMessage(msg, threadID, messageID);
};

module.exports.run = async ({ event, api, Currencies }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (data.work2Time && cooldown - (Date.now() - data.work2Time) > 0) {
        var timeLeft = cooldown - (Date.now() - data.work2Time);
        var minutes = Math.floor(timeLeft / 60000);
        var seconds = ((timeLeft % 60000) / 1000).toFixed(0);
        return api.sendMessage(`⏳ আবার চেষ্টা করুন ${minutes} মিনিট ${seconds < 10 ? "0" + seconds : seconds} সেকেন্ড পর।`, threadID, messageID);
    }

    return api.sendMessage(
        `🍀 আজকের কাজের তালিকা:\n\n` +
        `1. 🏭 ইন্ডাস্ট্রি জোন\n` +
        `2. 🧰 সার্ভিস সেক্টর\n` +
        `3. 🛢️ তেলের খনি\n` +
        `4. ⛏️ খনিজ খনি\n` +
        `5. 🪨 পাথর খনন\n` +
        `6. 🫣 রহস্যময় অপশন\n` +
        `7. 🔧 আসছে...\n\n` +
        `✅ একটি অপশন নম্বর রিপ্লাই করুন (১-৭)`, threadID,
        (err, info) => {
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        }
    );
};
