const axios = require("axios");
const request = require("request");
const fs = require("fs");

module.exports.config = {
	name: "virgin",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "নূর মোহাম্মদ ",
	description: "র‍্যান্ডম সুন্দর ছেলের ছবি পাঠাও 🤭",
	commandCategory: "random-img",
	usages: "virgin",
	cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
	try {
		const res = await axios.get(`https://api.satanic.clownz-nam.repl.co/trinh`);
		const imgURL = res.data.data;
		const ext = imgURL.substring(imgURL.lastIndexOf(".") + 1);
		const filePath = `${__dirname}/cache/trinh.${ext}`;

		const callback = () => {
			api.sendMessage({
				body: "তোমার জন্য সেরা 'ভার্জিন' ছেলে 😏👇",
				attachment: fs.createReadStream(filePath)
			}, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
		};

		request(imgURL).pipe(fs.createWriteStream(filePath)).on("close", callback);
	} catch (e) {
		api.sendMessage("😥 দুঃখিত, আপাতত ছবি আনতে পারলাম না!", event.threadID, event.messageID);
	}
};
