// 📌 এই কোডটি "ranktop.js" নামে সেভ করো // গ্রুপের টপ ১০ ইউজার র‍্যাংক দেখাবে (এক্সপি অনুযায়ী)

module.exports.config = { name: "ranktop", version: "1.0.0", hasPermssion: 0, credits: "নূর মোহাম্মদ + ChatGPT", description: "গ্রুপের টপ ১০ এক্সপি র‍্যাংক লিস্ট", commandCategory: "Group", usages: "", cooldowns: 5, };

module.exports.run = async function ({ api, event, Currencies, Users }) { try { const threadID = event.threadID; let dataAll = await Currencies.getAll(["userID", "exp"]);

dataAll.sort((a, b) => b.exp - a.exp);
const top10 = dataAll.slice(0, 10);

let msg = "🏆 [ গ্রুপ র‍্যাংকিং টপ ১০ ] 🏆\n\n";
for (let i = 0; i < top10.length; i++) {
  const name = global.data.userName.get(top10[i].userID) || await Users.getNameUser(top10[i].userID);
  const level = Math.floor((Math.sqrt(1 + (4 * top10[i].exp) / 3) + 1) / 2);
  msg += `${i + 1}. ${name}\n   📶 Level: ${level} | ⭐ Exp: ${top10[i].exp}\n\n`;
}
api.sendMessage(msg, threadID);

} catch (err) { console.log(err); api.sendMessage("❌ র‍্যাংক লিস্ট আনতে সমস্যা হয়েছে! পরে চেষ্টা করুন।", event.threadID); } };

