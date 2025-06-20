module.exports.config = {
    name: "listadmin",
    version: '1.0.1',
    hasPermssion: 0,
    credits: "নূর মোহাম্মদ ",
    description: "গ্রুপের সকল অ্যাডমিনদের তালিকা দেখায়",
    commandCategory: "group",
    usages: "listadmin",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const adminIDs = threadInfo.adminIDs;
    let msg = `👑 এই গ্রুপে মোট ${adminIDs.length} জন অ্যাডমিন রয়েছে:\n\n`;
    let count = 1;

    for (const admin of adminIDs) {
        const userInfo = await api.getUserInfo(admin.id);
        const name = userInfo[admin.id].name || "Unknown";
        msg += `${count++}. ${name}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━━\n🔰 মডিউল নির্মাতা: নূর মোহাম্মদ\n🌐 ফেসবুক: https://www.facebook.com/nur.mohammad.367314\n❤️ Smart Bot by ChatGPT`;

    return api.sendMessage(msg, event.threadID, event.messageID);
};
