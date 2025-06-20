module.exports.config = {
	name: "rule",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "নূর মোহাম্মদ + ChatGPT",
	description: "গ্রুপের নিয়মাবলী সংরক্ষণ, দেখানো, মুছে ফেলা",
	commandCategory: "গ্রুপ ম্যানেজ",
	usages: "[add/remove/all] [নিয়ম বা আইডি]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = () => {
	const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const filePath = join(__dirname, "cache", "rules.json");
	if (!existsSync(filePath)) writeFileSync(filePath, "[]", "utf-8");
};

module.exports.run = ({ event, api, args, permssion }) => {
	const { threadID, messageID } = event;
	const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const filePath = join(__dirname, "cache", "rules.json");

	const input = args.slice(1).join(" ");
	let data = JSON.parse(readFileSync(filePath, "utf-8"));
	let currentGroup = data.find(i => i.threadID == threadID) || { threadID, listRule: [] };

	switch (args[0]) {
		case "add": {
			if (permssion == 0) return api.sendMessage("⚠️ দুঃখিত, আপনি নিয়ম যোগ করতে পারছেন না।", threadID, messageID);
			if (!input) return api.sendMessage("📌 দয়া করে যুক্ত করতে একটি নিয়ম লিখুন।", threadID, messageID);

			const newRules = input.split("\n");
			for (const rule of newRules) currentGroup.listRule.push(rule);

			api.sendMessage("✅ নতুন নিয়ম সফলভাবে যুক্ত করা হয়েছে।", threadID, messageID);
			break;
		}

		case "remove":
		case "rm":
		case "delete": {
			if (permssion == 0) return api.sendMessage("⚠️ আপনার এই নিয়ম মুছে ফেলার অনুমতি নেই।", threadID, messageID);

			if (input === "all") {
				currentGroup.listRule = [];
				api.sendMessage("🗑️ সমস্ত নিয়ম মুছে ফেলা হয়েছে।", threadID, messageID);
				break;
			}

			const index = parseInt(input);
			if (isNaN(index) || index < 1 || index > currentGroup.listRule.length)
				return api.sendMessage("❌ অনুগ্রহ করে সঠিক নিয়ম নম্বর লিখুন মুছে ফেলার জন্য।", threadID, messageID);

			currentGroup.listRule.splice(index - 1, 1);
			api.sendMessage(`✅ নিয়ম নম্বর ${index} সফলভাবে মুছে ফেলা হয়েছে।`, threadID, messageID);
			break;
		}

		case "list":
		case "all": {
			if (currentGroup.listRule.length == 0)
				return api.sendMessage("⚠️ এই গ্রুপে এখনও কোন নিয়ম যোগ করা হয়নি।", threadID, messageID);

			let msg = "📚 এই গ্রুপের নিয়মাবলী:\n\n";
			currentGroup.listRule.forEach((rule, i) => {
				msg += `${i + 1}. ${rule}\n`;
			});
			msg += `\n\n⚠️ নিয়ম মেনে চলুন, সুন্দর গ্রুপ বজায় রাখুন!\n— নূর মোহাম্মদ`;
			api.sendMessage(msg, threadID, messageID);
			break;
		}

		default: {
			if (currentGroup.listRule.length == 0)
				return api.sendMessage("⚠️ এই গ্রুপে এখনও কোন নিয়ম নেই।\nনিয়ম যোগ করতে ব্যবহার করুন:\n→ rule add [নিয়ম]", threadID, messageID);

			let msg = "📚 গ্রুপের বর্তমান নিয়ম:\n\n";
			currentGroup.listRule.forEach((rule, i) => {
				msg += `${i + 1}. ${rule}\n`;
			});
			msg += `\n✅ নিয়ম দেখতে বা মুছতে ব্যবহার করুন:\n→ rule all\n→ rule remove [নম্বর]`;
			api.sendMessage(msg, threadID, messageID);
		}
	}

	if (!data.some(i => i.threadID == threadID)) data.push(currentGroup);
	writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
};
