module.exports.config = { name: "user", version: "2.0.0", hasPermssion: 2, credits: "নূর মোহাম্মদ + ChatGPT", description: "ইউজার ব্যান/আনব্যান, কমান্ড ব্যান, সার্চ, লিস্ট ইত্যাদি।", commandCategory: "system", usages: "[ban/unban/search/list/info/banCommand/unbanCommand] [UID or নাম]", cooldowns: 5 };

module.exports.run = async ({ api, event, args, Users }) => { const { threadID, messageID, senderID } = event; const subCmd = args[0]; let targetID = args[1]; const reason = args.slice(2).join(" ") || null;

if (!targetID && event.messageReply) targetID = event.messageReply.senderID; if (!targetID && Object.keys(event.mentions).length > 0) targetID = Object.keys(event.mentions)[0];

if (!targetID || isNaN(targetID)) return api.sendMessage("⚠️ সঠিকভাবে একটি ইউজার আইডি বা মেনশন দিন।", threadID, messageID);

const userName = global.data.userName.get(targetID) || await Users.getNameUser(targetID);

const alreadyBanned = global.data.userBanned.get(targetID); const commandBannedList = global.data.commandBanned.get(targetID) || [];

switch (subCmd) { case "ban": case "-b": { if (alreadyBanned) return api.sendMessage(🚫 ইউজার আগে থেকেই ব্যান করা আছে।\nকারণ: ${alreadyBanned.reason || 'নেই'}\nসময়: ${alreadyBanned.dateAdded || 'অজানা'}, threadID, messageID); const time = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }); await Users.setData(targetID, { data: { banned: true, reason, dateAdded: time } }); global.data.userBanned.set(targetID, { reason, dateAdded: time }); return api.sendMessage(✅ ব্যান সফল: ${userName} (${targetID}), threadID, messageID); }

case "unban":
case "-ub": {
  if (!alreadyBanned) return api.sendMessage("❌ ইউজার ব্যানে ছিল না।", threadID, messageID);
  await Users.setData(targetID, { data: { banned: false, reason: null, dateAdded: null } });
  global.data.userBanned.delete(targetID);
  return api.sendMessage(`✅ আনব্যান সফল: ${userName} (${targetID})`, threadID, messageID);
}

case "banCommand":
case "-bc": {
  if (!reason) return api.sendMessage("⚠️ কোন কোন কমান্ড ব্যান করবেন তা দিন। (যেমন: refine anime help)", threadID, messageID);
  const cmds = reason === "all" ? Array.from(global.client.commands.keys()) : reason.split(" ");
  const updated = Array.from(new Set([...commandBannedList, ...cmds]));
  await Users.setData(targetID, { data: { commandBanned: updated } });
  global.data.commandBanned.set(targetID, updated);
  return api.sendMessage(`🚫 ${cmds.length} টি কমান্ড ব্যান করা হয়েছে ${userName} (${targetID}) এর জন্য।`, threadID, messageID);
}

case "unbanCommand":
case "-ubc": {
  if (commandBannedList.length === 0) return api.sendMessage("⚠️ এই ইউজারের জন্য কোনো কমান্ড ব্যান করা ছিল না।", threadID, messageID);
  if (!reason) return api.sendMessage("⚠️ কোন কমান্ড আনব্যান করবেন তা দিন।", threadID, messageID);
  const cmds = reason === "all" ? commandBannedList : reason.split(" ");
  const updated = commandBannedList.filter(cmd => !cmds.includes(cmd));
  if (updated.length === 0) global.data.commandBanned.delete(targetID);
  else global.data.commandBanned.set(targetID, updated);
  await Users.setData(targetID, { data: { commandBanned: updated } });
  return api.sendMessage(`✅ আনব্যান সফল: ${cmds.join(", ")} কমান্ড ${userName} (${targetID}) এর জন্য।`, threadID, messageID);
}

case "list":
case "-l": {
  let list = [];
  let i = 1;
  for (const [id, data] of global.data.userBanned.entries()) {
    const name = global.data.userName.get(id) || await Users.getNameUser(id);
    list.push(`${i++}. ${name} (${id}) - কারণ: ${data.reason || 'নেই'}`);
  }
  return api.sendMessage(`📋 ব্যানকৃত ইউজার (${list.length} জন):\n\n${list.join("\n")}`, threadID, messageID);
}

case "search":
case "-s": {
  const keyword = args.slice(1).join(" ");
  const allUsers = await Users.getAll(['userID', 'name']);
  const matched = allUsers.filter(u => u.name.toLowerCase().includes(keyword.toLowerCase()));
  if (!matched.length) return api.sendMessage("🔍 কোনো ইউজার পাওয়া যায়নি।", threadID, messageID);
  const result = matched.map((u, idx) => `${idx + 1}. ${u.name} (${u.userID})`).join("\n");
  return api.sendMessage(`🔎 ইউজার মিলেছে:\n${result}`, threadID, messageID);
}

case "info":
case "-i": {
  const banned = alreadyBanned ? `✅ হ্যাঁ (কারণ: ${alreadyBanned.reason}, সময়: ${alreadyBanned.dateAdded})` : "❌ না";
  const cmdBanned = commandBannedList.length ? `🚫 হ্যাঁ (${commandBannedList.join(", ")})` : "❌ না";
  return api.sendMessage(`ℹ️ ইউজার তথ্যঃ\n👤 নাম: ${userName}\n🆔 ID: ${targetID}\n⛔ ব্যান: ${banned}\n📛 কমান্ড ব্যান: ${cmdBanned}`, threadID, messageID);
}

default:
  return api.sendMessage("⚠️ উপযুক্ত সাব-কমান্ড দিন (ban, unban, banCommand, unbanCommand, info, list, search)", threadID, messageID);

} };

