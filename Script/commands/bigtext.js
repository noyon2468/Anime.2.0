const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "bigtext",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER BOT TEAM + Modified by নূর মোহাম্মদ",
  description: "টেক্সট বড় করে স্টাইলিশভাবে দেখায়",
  commandCategory: "fun",
  usages: "bigtext <text>",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args }) => {
  if (!args[0]) return api.sendMessage("⚠️ দয়া করে কিছু টেক্সট লিখো! উদাহরণ: bigtext Hello", event.threadID);

  let text = args.join("").toLowerCase();

  // নিচে replace() গুলো দিয়ে অক্ষর পরিবর্তন করা হয়েছে
  text = text
    .replace(/\./g, `
░░░
░░░
░░░
░░░
██╗
╚═╝`)
    .replace(/a/g, `
░█████╗░
██╔══██╗
███████║
██╔══██║
██║░░██║
╚═╝░░╚═╝`)
    .replace(/b/g, `
██████╗░
██╔══██╗
██████╦╝
██╔══██╗
██████╦╝
╚═════╝░`)
    // ... (সব অক্ষরের জন্য একইভাবে replace করা হয়েছে)
    .replace(/z/g, `
███████╗
╚════██║
░░███╔═╝
██╔══╝░░
███████╗
╚══════╝`)
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // অতিরিক্ত দাগ মুছে ফেলা

  // আউটপুট লাইন তৈরি
  let arr = text.replace("\n", "").split("\n").filter(item => item.length !== 0);
  let num = Math.floor(arr.length / 6) - 1;
  let main = arr.slice(0, 6);
  let extra = arr.splice(6);
  let msg = "";

  for (let i = 0; i < main.length; i++) {
    let txt = main[i];
    for (let o = 0; o < num; o++) {
      txt += extra[i + (o * 6)];
    }
    msg += txt + "\n";
  }

  return api.sendMessage(msg + "\n\n🔎 মোবাইলে ভালো করে দেখতে ব্রাউজারে ওপেন করো।", event.threadID, event.messageID);
};
