module.exports.config = {
  name: "guard",
  version: "2.0.0",
  credits: "নূর মোহাম্মদ",
  description: "Admin Guard চালু/বন্ধ এবং অবস্থা দেখার কমান্ড",
  commandCategory: "group",
  usages: "[on/off/status]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, messageID, senderID } = event;
  const data = await Threads.getData(threadID) || {};
  const threadData = data.data || {};

  const input = args[0]?.toLowerCase();

  if (!["on", "off", "status"].includes(input)) {
    return api.sendMessage(
      `🛡️ Guard System কমান্ড:\n\n• guard on ➤ চালু করো\n• guard off ➤ বন্ধ করো\n• guard status ➤ বর্তমান অবস্থা`,
      threadID, messageID
    );
  }

  switch (input) {
    case "on":
      threadData.guard = true;
      await Threads.setData(threadID, { data: threadData });
      return api.sendMessage(`✅ Admin Guard এখন *চালু* আছে!\n🔐 কেউ অ্যাডমিন পরিবর্তন করতে পারবে না।`, threadID, messageID);

    case "off":
      threadData.guard = false;
      await Threads.setData(threadID, { data: threadData });
      return api.sendMessage(`⚠️ Admin Guard এখন *বন্ধ* আছে!\n🧨 সবাই অ্যাডমিন পরিবর্তন করতে পারবে।`, threadID, messageID);

    case "status":
      const status = threadData.guard === true ? "🔒 চালু" : "🔓 বন্ধ";
      return api.sendMessage(`📊 Guard Status: ${status}`, threadID, messageID);
  }
};
