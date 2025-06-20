module.exports.config = {
  name: "autoreact",
  version: "1.1.2",
  hasPermission: 0,
  credits: "CYBER BOT TEAM + Modified by নূর মোহাম্মদ",
  description: "Bot auto reacts based on message content",
  commandCategory: "No Prefix",
  usages: "[]",
  cooldowns: 0
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase();

  const reactList = [
    { keywords: ["soul"], emoji: "🖤" },
    { 
      keywords: [
        "mahal", "krishna", "mahakal", "mahadev", "ram", "love", "lab", "ilove", "labyu", "kiss", "crush", "kilig", 
        "fuck", "@নূর মোহাম্মদ", "sex", "porn", "kantot", "iyotan", "pasend", "iyot", "eut", "😍", "shet", "send", 
        "baby", "babe", "babi", "bby", "manyak", "libog", "horn", "abno", "malibog", "labs", "pekpek", "🤭", "🥰", 
        "puke", "bilat", "puday", "finger", "pipinger", "pinger", "mwah", "mwuah", "angel", "jordan", "marry", "😇", "🤡"
      ],
      emoji: "❤️"
    },
    { 
      keywords: [
        "sakit", "saket", "pain", "mamatay", "ayaw ko na", "saktan", "sad", "malungkot", "😥", "😰", "😨", "😢", ":(", 
        "😔", "😞", "depress", "stress", "depression", "kalungkutan", "😭"
      ],
      emoji: "😢"
    },
    { keywords: ["india", "bharat"], emoji: "🇧🇩" },
    { keywords: ["eve", "morning", "afternoon", "evening", "eat", "night", "nyt"], emoji: "❤" },
    { keywords: ["wow", "robot"], emoji: "😮" }
  ];

  for (const react of reactList) {
    if (react.keywords.some(keyword => msg.includes(keyword))) {
      api.setMessageReaction(react.emoji, messageID, (err) => {}, true);
      break;
    }
  }
};

module.exports.run = function() {
  // No manual command
};
