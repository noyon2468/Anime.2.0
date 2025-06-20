// 📌 Updated and Personalized Baby Command by নূর মোহাম্মদ + ChatGPT const axios = require("axios");

const baseApiUrl = async () => { const base = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"); return base.data.api; };

module.exports.config = { name: "baby", version: "6.9.9", credits: "নূর মোহাম্মদ + ChatGPT", cooldowns: 0, hasPermssion: 0, description: "Smart learning chat bot system", commandCategory: "chat", usePrefix: true, prefix: true, usages: [message]\nteach [text] - [reply1], [reply2]\nteach react [text] - [reaction1], [reaction2]\nremove [text]\nrm [text] - [index]\nedit [text] - [newText]\nmsg [text]\nlist / list all, };

module.exports.run = async function ({ api, event, args, Users }) { try { const link = ${await baseApiUrl()}/baby; const query = args.join(" ").toLowerCase(); const uid = event.senderID;

if (!args[0]) {
  const replies = ["Bolo Baby 💬", "Hum... ✨", "Type `baby help` 📝"];
  return api.sendMessage(replies[Math.floor(Math.random() * replies.length)], event.threadID, event.messageID);
}

if (args[0] === "remove") {
  const text = query.replace("remove ", "");
  const res = await axios.get(`${link}?remove=${text}&senderID=${uid}`);
  return api.sendMessage(res.data.message, event.threadID, event.messageID);
}

if (args[0] === "rm" && query.includes("-")) {
  const [text, index] = query.replace("rm ", "").split(" - ");
  const res = await axios.get(`${link}?remove=${text}&index=${index}`);
  return api.sendMessage(res.data.message, event.threadID, event.messageID);
}

if (args[0] === "list") {
  const res = await axios.get(`${link}?list=all`);
  const data = res.data.teacher.teacherList;
  const teachers = await Promise.all(data.map(async item => {
    const id = Object.keys(item)[0];
    const count = item[id];
    let name = await Users.getName(id);
    if (id === "100035389598342") name = "👑 নূর মোহাম্মদ (Owner)";
    return { name, count };
  }));
  teachers.sort((a, b) => b.count - a.count);
  const out = teachers.map((t, i) => `${i + 1}. ${t.name}: ${t.count}`).join("\n");
  return api.sendMessage(`👥 মোট শিক্ষক: ${teachers.length}\n\n${out}`, event.threadID, event.messageID);
}

if (["msg", "message"].includes(args[0])) {
  const text = query.replace("msg ", "");
  const res = await axios.get(`${link}?list=${text}`);
  return api.sendMessage(`✉️ ${text} এর উত্তর: ${res.data.data}`, event.threadID, event.messageID);
}

if (args[0] === "edit") {
  const [oldText, newText] = query.replace("edit ", "").split(" - ");
  const res = await axios.get(`${link}?edit=${oldText}&replace=${newText}`);
  return api.sendMessage(`✅ সফলভাবে পরিবর্তন হয়েছে: ${res.data.message}`, event.threadID, event.messageID);
}

if (args[0] === "teach" && args[1] === "react") {
  const [text, reacts] = query.replace("teach react ", "").split(" - ");
  const res = await axios.get(`${link}?teach=${text}&react=${reacts}`);
  return api.sendMessage(`✨ রিঅ্যাকশন শিখানো হয়েছে: ${res.data.message}`, event.threadID, event.messageID);
}

if (args[0] === "teach") {
  const [text, replies] = query.replace("teach ", "").split(" - ");
  const res = await axios.get(`${link}?teach=${text}&reply=${replies}&senderID=${uid}`);
  const teacherName = uid === "100035389598342" ? "👑 নূর মোহাম্মদ (Owner)" : await Users.getName(res.data.teacher) || "Unknown";
  return api.sendMessage(`✅ নতুন উত্তর শিখানো হয়েছে!

📘 টিচার: ${teacherName} 📌 বার্তা: ${text}`, event.threadID, event.messageID); }

if (["amar name ki", "amr nam ki"].some(phrase => query.includes(phrase))) {
  const res = await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`);
  return api.sendMessage(res.data.reply, event.threadID, event.messageID);
}

const response = (await axios.get(`${link}?text=${encodeURIComponent(query)}&senderID=${uid}&font=1`)).data.reply;
return api.sendMessage(response, event.threadID, (e, info) => {
  global.client.handleReply.push({
    name: this.config.name,
    type: "reply",
    messageID: info.messageID,
    author: uid,
    lnk: response,
    apiUrl: link
  });
}, event.messageID);

} catch (e) { return api.sendMessage(❌ Error: ${e.message}, event.threadID, event.messageID); } };

