module.exports.config = {
  name: "autosetname",
  eventType: ["log:subscribe"],
  version: "1.1.0",
  credits: "নূর মোহাম্মদ",
  description: "Automatically set nicknames for new members using saved prefix"
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, logMessageData } = event;
  const fs = require("fs-extra");
  const path = require("path");

  const dataPath = path.join(__dirname, "cache", "autosetname.json");
  let dataJson = [];

  // ফাইল না থাকলে তৈরি করো
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  else dataJson = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const thisThread = dataJson.find(item => item.threadID == threadID);
  if (!thisThread || !thisThread.nameUser || thisThread.nameUser.length === 0) return;

  const prefixList = thisThread.nameUser;
  const newMembers = logMessageData.addedParticipants;

  let done = [];

  for (let i = 0; i < newMembers.length; i++) {
    const userID = newMembers[i].userFbId;
    const prefix = prefixList[i % prefixList.length]; // রাউন্ড রোটেট করে prefix

    const info = await Users.getData(userID);
    const fullName = info.name || "Friend";

    const nickname = `${prefix} ${fullName}`;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await api.changeNickname(nickname, threadID, userID);
      done.push(nickname);
    } catch (err) {
      console.log(`Nickname set failed for ${userID}`);
    }
  }

  if (done.length > 0) {
    return api.sendMessage(`✅ ${done.length} জন নতুন মেম্বারের nickname সেট করা হয়েছে:\n- ${done.join("\n- ")}`, threadID);
  }
};
