const fs = require("fs");

module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
	version: "1.0.0",
	credits: "নূর মোহাম্মদ + CYBER TEAM",
	description: "গ্রুপে বট অ্যাড/রিমুভ/নাম পরিবর্তনের নোটিফিকেশন পাঠাবে",
	envConfig: {
		enable: true
	}
};

module.exports.run = async function ({ api, event, Threads }) {
	const logger = require("../../utils/log");

	if (!global.configModule[this.config.name]?.enable) return;

	let task = "";
	let formReport = `=== 🤖 𝐁𝐎𝐓 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 ===\n\n» গ্রুপ আইডি: ${event.threadID}\n» অ্যাকশন: {task}\n» ইউজার আইডি: ${event.author}\n» সময়: ${new Date().toLocaleString("bn-BD")}`;

	switch (event.logMessageType) {
		case "log:thread-name": {
			const oldData = await Threads.getData(event.threadID);
			const oldName = oldData?.name || "আগের নাম অজানা";
			const newName = event.logMessageData.name || "নতুন নাম অজানা";

			task = `গ্রুপের নাম পরিবর্তন:\n👉 আগের: '${oldName}'\n👉 নতুন: '${newName}'`;

			await Threads.setData(event.threadID, { name: newName });
			break;
		}

		case "log:subscribe": {
			const addedByBot = event.logMessageData.addedParticipants?.some(p => p.userFbId == api.getCurrentUserID());
			if (addedByBot) task = "🤖 বট নতুন একটি গ্রুপে অ্যাড হয়েছে!";
			break;
		}

		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
				task = "😓 বটকে গ্রুপ থেকে রিমুভ করে দেয়া হয়েছে!";
			}
			break;
		}
	}

	if (task.length === 0) return;

	formReport = formReport.replace("{task}", task);

	const god = "100042628373363"; // ✅ তোমার আপডেট করা নতুন UID

	return api.sendMessage(formReport, god, (err) => {
		if (err) return logger("⚠️ লগ পাঠাতে সমস্যা:\n" + formReport, "[ Logging Error ]");
	});
};
