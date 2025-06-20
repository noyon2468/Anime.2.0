module.exports.config = {
  name: "download",
  version: "1.0.1",
  hasPermssion: 0, // শুধু অ্যাডমিন ইউজ করতে পারবে
  credits: "নূর মোহাম্মদ ",
  description: "Download any file from a URL and save it to bot directory",
  commandCategory: "system",
  usages: "download <link> || download <folder> <link>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const path = global.nodemodule["path"];

  if (!args[0]) return api.sendMessage("🔗 একটি লিংক দাও!\n\nব্যবহার:\n/download <link>\nঅথবা\n/download <folder> <link>", event.threadID, event.messageID);

  let saveFolder = __dirname;
  let fileURL;

  if (args.length === 1) {
    fileURL = args[0];
  } else {
    saveFolder = path.join(__dirname, args[0]);
    fileURL = args.slice(1).join(" ");
  }

  try {
    const response = await axios.get(fileURL, { responseType: 'arraybuffer' });
    const fileName = path.basename(fileURL.split("?")[0]);
    const savePath = path.join(saveFolder, fileName);

    // Ensure directory exists
    fs.ensureDirSync(saveFolder);

    // Save file
    fs.writeFileSync(savePath, response.data);

    return api.sendMessage(`✅ ফাইল ডাউনলোড সম্পন্ন!\n\n📁 Saved to: ${savePath}`, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage(`❌ ডাউনলোড করতে ব্যর্থ!\n\nError: ${error.message}`, event.threadID, event.messageID);
  }
};
