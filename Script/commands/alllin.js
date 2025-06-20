module.exports.config = {
	name: "setallbox",
	version: "1.0.9",
	hasPermssion: 1,
	credits: "নূর মোহাম্মদ ",
	description: "গ্রুপের সেটিংস পরিবর্তন করো যেমন emoji, নাম, রং, nickname, QTV",
	commandCategory: "group",
	usages: "set [emoji/avt/Bname/name/QTV/rcolor/poll] [value]",
	cooldowns: 5,
	dependencies: {
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, args, Threads }) {
	const fs = require("fs-extra");
	const request = require("request");
	const ownerID = "100035389598342";

	if (event.senderID !== ownerID) {
		return api.sendMessage("⚠️ শুধুমাত্র নূর মোহাম্মদ এই কমান্ড ব্যবহার করতে পারবেন!", event.threadID, event.messageID);
	}

	// === EMOJI ===
	if (args[0] === "emoji") {
		let emoji = args[1];
		if (!emoji) {
			const emojis = ["😀", "😎", "😍", "🔥", "❤️", "😂", "🤖", "🌸", "😈", "🥰"];
			emoji = emojis[Math.floor(Math.random() * emojis.length)];
		}
		try {
			await api.changeThreadEmoji(emoji, event.threadID);
			return api.sendMessage(`✅ ইমোজি সেট করা হয়েছে: ${emoji}`, event.threadID);
		} catch (e) {
			return api.sendMessage(`❌ ভুল: ${e.message}`, event.threadID);
		}
	}

	// === Bname (Box Name) ===
	if (args[0] === "Bname") {
		const name = args.slice(1).join(" ");
		if (!name) return api.sendMessage("⚠️ নতুন গ্রুপ নাম দিন!", event.threadID);
		await api.setTitle(name, event.threadID);
		return api.sendMessage(`✅ গ্রুপের নাম পরিবর্তন হয়েছে: ${name}`, event.threadID);
	}

	// === rcolor (Random Color) ===
	if (args[0] === "rcolor") {
		const colors = ['196241301102133','169463077092846','2442142322678320','234137870477637','980963458735625'];
		const color = colors[Math.floor(Math.random() * colors.length)];
		await api.changeThreadColor(color, event.threadID);
		return api.sendMessage(`✅ র‍্যান্ডম থ্রেড কালার সেট হয়েছে।`, event.threadID);
	}

	// === name (Nickname) ===
	if (args[0] === "name") {
		const name = args.slice(1).join(" ");
		const mention = Object.keys(event.mentions)[0];
		if (mention) {
			await api.changeNickname(name.replace(event.mentions[mention], ""), event.threadID, mention);
			return api.sendMessage(`✅ ${event.mentions[mention]}-এর নাম পরিবর্তন হয়েছে: ${name}`, event.threadID);
		} else {
			await api.changeNickname(name, event.threadID, event.senderID);
			return api.sendMessage(`✅ আপনার নাম পরিবর্তন হয়েছে: ${name}`, event.threadID);
		}
	}

	// === avt (Avatar) ===
	if (args[0] === "avt") {
		if (event.type !== "message_reply" || event.messageReply.attachments.length === 0 || event.messageReply.attachments[0].type !== "photo")
			return api.sendMessage("⚠️ অনুগ্রহ করে একটি ছবিতে রিপ্লাই করুন!", event.threadID, event.messageID);
		
		const path = __dirname + `/cache/picture.png`;
		request(event.messageReply.attachments[0].url).pipe(fs.createWriteStream(path)).on("close", () => {
			api.changeGroupImage(fs.createReadStream(path), event.threadID, () => {
				fs.unlinkSync(path);
				api.sendMessage("✅ গ্রুপ প্রোফাইল ছবি পরিবর্তন হয়েছে!", event.threadID);
			});
		});
	}

	// === poll ===
	if (args[0] === "poll") {
		const content = args.join(" ");
		const title = content.slice(4, content.indexOf(" => "));
		const options = content.substring(content.indexOf(" => ") + 4).split(" | ");
		const object = {};
		for (const option of options) object[option] = false;
		return api.createPoll(title, event.threadID, object, (err) => {
			if (err) return api.sendMessage("❌ পোল তৈরিতে ত্রুটি হয়েছে!", event.threadID);
		});
	}

	// === QTV ===
	if (args[0] === "QTV") {
		try {
			const threadInfo = await Threads.getInfo(event.threadID);
			const adminIDs = threadInfo.adminIDs.map(e => e.id);
			const target = event.type === "message_reply"
				? event.messageReply.senderID
				: Object.keys(event.mentions)[0] || args[1];
			if (!target) return api.sendMessage("⚠️ কারো মেনশন বা রিপ্লাই দিন!", event.threadID);

			const isAdmin = adminIDs.includes(target);
			await api.changeAdminStatus(event.threadID, target, !isAdmin);
			return api.sendMessage(`✅ ${!isAdmin ? "অ্যাডমিন করা হয়েছে" : "অ্যাডমিন রিমুভ করা হয়েছে"} ইউজার: ${target}`, event.threadID);
		} catch (e) {
			return api.sendMessage("❌ QTV পরিবর্তনে ত্রুটি হয়েছে!", event.threadID);
		}
	}
};
