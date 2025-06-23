module.exports.config = {
  name: "cmd",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "নূর মোহাম্মদ",
  description: "বটের সব কমান্ড চালু/বন্ধ করুন",
  commandCategory: "সিস্টেম",
  usages: "[load/unload/loadAll/unloadAll/info/count] [moduleName]",
  cooldowns: 2,
  dependencies: {
    "fs-extra": "",
    "child_process": "",
    "path": ""
  }
};

const loadCommand = ({ moduleList, threadID, messageID, api }) => {
  const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
  const { configPath, mainPath } = global.client;
  const logger = require(mainPath + "/utils/log");

  const errorList = [];
  delete require.cache[require.resolve(configPath)];
  const configValue = require(configPath);
  writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 2), "utf8");

  for (const nameModule of moduleList) {
    try {
      const dirModule = __dirname + "/" + nameModule + ".js";
      delete require.cache[require.resolve(dirModule)];
      const command = require(dirModule);
      global.client.commands.delete(nameModule);

      if (!command.config || !command.run || !command.config.commandCategory)
        throw new Error("ফরম্যাট ঠিক নেই!");

      global.client.eventRegistered = global.client.eventRegistered.filter(info => info !== command.config.name);
      global.client.commands.set(command.config.name, command);
      logger.loader("লোড হয়েছে → " + command.config.name);
    } catch (error) {
      errorList.push(`- ${nameModule}: ${error.message}`);
    }
  }

  if (errorList.length > 0) {
    api.sendMessage("❌ নিচের মডিউল লোড করতে ব্যর্থ:\n" + errorList.join("\n"), threadID, messageID);
  } else {
    api.sendMessage("✅ সফলভাবে লোড হলো:\n" + moduleList.join(", "), threadID, messageID);
  }

  writeFileSync(configPath, JSON.stringify(configValue, null, 4), "utf8");
  unlinkSync(configPath + ".temp");
};

const unloadModule = ({ moduleList, threadID, messageID, api }) => {
  const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
  const { configPath, mainPath } = global.client;
  const logger = require(mainPath + "/utils/log").loader;

  delete require.cache[require.resolve(configPath)];
  const configValue = require(configPath);
  writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), "utf8");

  for (const nameModule of moduleList) {
    global.client.commands.delete(nameModule);
    global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
    configValue["commandDisabled"].push(`${nameModule}.js`);
    global.config["commandDisabled"].push(`${nameModule}.js`);
    logger(`বন্ধ করা হলো → ${nameModule}`);
  }

  writeFileSync(configPath, JSON.stringify(configValue, null, 4), "utf8");
  unlinkSync(configPath + ".temp");
  api.sendMessage(`🛑 ${moduleList.length}টি কমান্ড সফলভাবে বন্ধ করা হয়েছে।`, threadID, messageID);
};

module.exports.run = async function ({ event, args, api }) {
  const OWNER_ID = "100035389598342";
  const { readdirSync } = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;

  if (senderID !== OWNER_ID)
    return api.sendMessage("❌ আপনি এই কমান্ড ব্যবহারের অনুমতি পাননি, ভাই।", threadID, messageID);

  let moduleList = args.slice(1);

  switch (args[0]) {
    case "count": {
      return api.sendMessage(`📊 মোট লোড করা কমান্ড সংখ্যা: ${global.client.commands.size}`, threadID, messageID);
    }
    case "load": {
      if (moduleList.length === 0) return api.sendMessage("⚠️ কোন মডিউলের নাম দেননি!", threadID, messageID);
      return loadCommand({ moduleList, threadID, messageID, api });
    }
    case "unload": {
      if (moduleList.length === 0) return api.sendMessage("⚠️ কোন মডিউলের নাম দেননি!", threadID, messageID);
      return unloadModule({ moduleList, threadID, messageID, api });
    }
    case "loadAll": {
      moduleList = readdirSync(__dirname).filter(file => file.endsWith(".js") && !file.includes("example") && !file.includes("cmd"));
      moduleList = moduleList.map(file => file.replace(/\.js$/, ""));
      return loadCommand({ moduleList, threadID, messageID, api });
    }
    case "unloadAll": {
      moduleList = readdirSync(__dirname).filter(file => file.endsWith(".js") && !file.includes("example") && !file.includes("cmd"));
      moduleList = moduleList.map(file => file.replace(/\.js$/, ""));
      return unloadModule({ moduleList, threadID, messageID, api });
    }
    case "info": {
      const cmd = global.client.commands.get(moduleList.join("") || "");
      if (!cmd) return api.sendMessage("❌ উল্লিখিত কমান্ড খুঁজে পাওয়া যায়নি!", threadID, messageID);
      const { name, version, hasPermssion, credits, cooldowns, dependencies } = cmd.config;

      return api.sendMessage(
        `📦 কমান্ড: ${name}\n` +
        `✍️ নির্মাতা: ${credits}\n` +
        `🌀 ভার্সন: ${version}\n` +
        `🛡️ পারমিশন: ${hasPermssion == 0 ? "সাধারণ ইউজার" : hasPermssion == 1 ? "অ্যাডমিন" : "সাপোর্ট/মাস্টার"}\n` +
        `⏱️ কুলডাউন: ${cooldowns}s\n` +
        `📚 ডিপেন্ডেন্সি: ${(Object.keys(dependencies || {})).join(", ") || "কিছু নেই"}`,
        threadID, messageID
      );
    }
    default: {
      return api.sendMessage("❓ কমান্ডটি সঠিক নয়!\nউদাহরণ: cmd load [নাম], cmd unloadAll", threadID, messageID);
    }
  }
};
