module.exports.config = {
    name: "listadmin",
    version: '1.0.1',
    hasPermssion: 0,
    credits: "Nur Muhammad + ChatGPT",
    description: "গ্রুপের এডমিনদের তালিকা দেখায়",
    commandCategory: "group",
    usages: "/listadmin",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, Users }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const adminList = threadInfo.adminIDs;
        const adminCount = adminList.length;
        let msg = `🌺 এই গ্রুপে মোট ${adminCount} জন অ্যাডমিন আছেন:\n\n`;
        let index = 1;

        for (const admin of adminList) {
            const userInfo = await api.getUserInfo(admin.id);
            const name = userInfo[admin.id].name;
            msg += `🔹 ${index++}. ${name}\n`;
        }

        msg += `\n🌸 অনুরোধে তালিকা করেছেন: নূর মোহাম্মদ`;
        return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (err) {
        return api.sendMessage("❌ অ্যাডমিন তালিকা আনতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
};
