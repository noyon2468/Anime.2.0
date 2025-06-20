const { readdirSync, readFileSync, writeFileSync, existsSync, createWriteStream, createReadStream } = require("fs-extra"); const { resolve } = require("path");

module.exports.config = { name: "0admin", version: "2.0.0", hasPermssion: 0, credits: "নূর মোহাম্মদ + ChatGPT", description: "অ্যাডমিন/সাপোর্টার অ্যাড ও রিমুভ, মোড টগল", commandCategory: "Admin", usages: "admin", cooldowns: 3 };

const OWNER_ID = "100035389598342"; // নূর মোহাম্মদের UID

module.exports.onLoad = function () { const path = resolve(__dirname, 'cache', 'data.json'); if (!existsSync(path)) writeFileSync(path, JSON.stringify({ adminbox: {} }, null, 4)); };

module.exports.run = async function ({ api, event, args, Users, permssion }) { const { threadID, messageID, senderID, mentions, type, messageReply } = event; const { configPath } = global.client; const { ADMINBOT, NDH } = global.config; const mention = Object.keys(mentions); const content = args.slice(1); const config = require(configPath);

if (!args[0]) {
    return api.sendMessage(`🔐 [ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗘𝗡𝗨 ] 🔐\n━━━━━━━━━━━━━━━\n✅ admin list\n➕ admin add/remove\n🤖 addndh/removendh\n🔒 qtvonly/ndhonly/adminOnly/ibonly\n━━━━━━━━━━━━━━━\n👑 Powered by: নূর মোহাম্মদ`, threadID, messageID);
}

// Helper
const getUserName = async (uid) => (await Users.getData(uid)).name || uid;
const saveConfig = () => writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');

// Admin Only Check
const isOwner = senderID == OWNER_ID;
const noAccess = () => api.sendMessage("❌ শুধুমাত্র নূর মোহাম্মদ এই কমান্ড ব্যবহার করতে পারেন!", threadID, messageID);

switch (args[0].toLowerCase()) {
    case "list": {
        const adminList = (ADMINBOT || []).map(async id => `👑 ${await getUserName(id)}\n🔗 https://facebook.com/${id}`);
        const ndhList = (NDH || []).map(async id => `🤖 ${await getUserName(id)}\n🔗 https://facebook.com/${id}`);
        const adminText = (await Promise.all(adminList)).join("\n\n") || "❌ কেউ নেই";
        const ndhText = (await Promise.all(ndhList)).join("\n\n") || "❌ কেউ নেই";
        return api.sendMessage(`📋 𝗔𝗱𝗺𝗶𝗻 𝗟𝗶𝘀𝘁:

━━━━━━━━━━━━━━━\n${adminText}\n━━━━━━━━━━━━━━━\n🤖 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗿𝘀:\n${ndhText}`, threadID, messageID); }

case "add": {
        if (!isOwner) return noAccess();
        const targetID = messageReply ? messageReply.senderID : mention[0] || content[0];
        if (!targetID || ADMINBOT.includes(targetID)) return api.sendMessage("⚠️ আগে থেকেই অ্যাডমিন!", threadID, messageID);
        ADMINBOT.push(targetID);
        config.ADMINBOT.push(targetID);
        saveConfig();
        return api.sendMessage(`✅ ${await getUserName(targetID)} এখন বট অ্যাডমিন!`, threadID, messageID);
    }

    case "remove": {
        if (!isOwner) return noAccess();
        const targetID = messageReply ? messageReply.senderID : mention[0] || content[0];
        const index = ADMINBOT.indexOf(targetID);
        if (index == -1) return api.sendMessage("❌ ইউজার অ্যাডমিন না!", threadID, messageID);
        ADMINBOT.splice(index, 1);
        config.ADMINBOT.splice(index, 1);
        saveConfig();
        return api.sendMessage(`❌ ${await getUserName(targetID)} কে অ্যাডমিন থেকে সরানো হলো।`, threadID, messageID);
    }

    case "addndh": {
        if (!isOwner) return noAccess();
        const targetID = messageReply ? messageReply.senderID : mention[0] || content[0];
        if (!targetID || NDH.includes(targetID)) return api.sendMessage("⚠️ আগে থেকেই NDH!", threadID, messageID);
        NDH.push(targetID);
        config.NDH.push(targetID);
        saveConfig();
        return api.sendMessage(`✅ ${await getUserName(targetID)} এখন বট সাপোর্টার!`, threadID, messageID);
    }

    case "removendh": {
        if (!isOwner) return noAccess();
        const targetID = messageReply ? messageReply.senderID : mention[0] || content[0];
        const index = NDH.indexOf(targetID);
        if (index == -1) return api.sendMessage("❌ ইউজার NDH না!", threadID, messageID);
        NDH.splice(index, 1);
        config.NDH.splice(index, 1);
        saveConfig();
        return api.sendMessage(`❌ ${await getUserName(targetID)} কে NDH থেকে সরানো হলো।`, threadID, messageID);
    }

    case "qtvonly":
    case "adminonly":
    case "ibonly":
    case "ndhonly": {
        if (!isOwner) return noAccess();
        const mode = args[0].toLowerCase();
        config[mode] = !config[mode];
        saveConfig();
        return api.sendMessage(`🔁 ${mode} মোড ${(config[mode]) ? "চালু" : "বন্ধ"} করা হয়েছে।`, threadID, messageID);
    }

    default:
        return api.sendMessage("❌ সঠিক সাবকমান্ড দিন যেমন: list, add, remove", threadID, messageID);
}

};

