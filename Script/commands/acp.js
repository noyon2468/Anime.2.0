module.exports.config = {
  name: "acp",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "CYBER TEAM + Customized by ChatGPT for Nur মোহাম্মদ",
  description: "Nur মোহাম্মদের মাধ্যমে Friend Request Accept/Delete",
  commandCategory: "bot id",
  usages: "uid",
  cooldowns: 0
};

const OWNER_ID = "100035389598342"; // 🔐 Nur মোহাম্মদ

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { listRequest } = handleReply;

  if (event.senderID !== OWNER_ID) {
    return api.sendMessage(
      "🚫 শুধুমাত্র ✨ নূর মোহাম্মদ ✨ এই কমান্ড চালাতে পারবেন!\nতুমি তো কেবল প্রজা 🐸",
      event.threadID
    );
  }

  const args = event.body.toLowerCase().split(" ");
  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };

  let action;
  if (args[0] === "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
    action = "accepted";
  } else if (args[0] === "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
    action = "deleted";
  } else {
    return api.sendMessage("⚠️ রিপ্লাই দিয়ে `add` বা `del` + ক্রমিক সংখ্যা / all লিখুন", event.threadID);
  }

  let targetIDs = args.slice(1);
  if (targetIDs[0] === "all") targetIDs = listRequest.map((_, i) => i + 1);

  const success = [], failed = [];

  for (const stt of targetIDs) {
    const user = listRequest[parseInt(stt) - 1];
    if (!user) {
      failed.push(`❌ STT ${stt} খুঁজে পাওয়া যায়নি`);
      continue;
    }

    form.variables.input.friend_requester_id = user.node.id;
    form.variables = JSON.stringify(form.variables);

    try {
      const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
      if (JSON.parse(res).errors) failed.push(user.node.name);
      else success.push(user.node.name);
    } catch {
      failed.push(user.node.name);
    }

    form.variables = JSON.parse(form.variables);
  }

  let msg = `✅ সফলভাবে ${action} হয়েছে ${success.length} জন:\n${success.join("\n")}`;
  if (failed.length > 0) msg += `\n❌ ব্যর্থ: ${failed.length} জন\n${failed.join("\n")}`;

  return api.sendMessage(msg, event.threadID);
};

module.exports.run = async ({ event, api }) => {
  if (event.senderID !== OWNER_ID) {
    return api.sendMessage(
      "⚠️ এই কমান্ড চালাতে তোমার অনুমতি নেই!\nশুধুমাত্র ✨ নূর মোহাম্মদ ✨ এটা চালাতে পারবেন 💂‍♂️",
      event.threadID
    );
  }

  const moment = require("moment-timezone");
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
  const listRequest = JSON.parse(res).data.viewer.friending_possibilities.edges;

  if (!listRequest.length) return api.sendMessage("😅 এখন কোনো friend request নেই!", event.threadID);

  let msg = "👤 Friend Request তালিকা:\n";
  listRequest.forEach((user, i) => {
    msg += `\n${i + 1}. নাম: ${user.node.name}\nID: ${user.node.id}\nলিংক: ${user.node.url.replace("www.facebook", "fb")}\nসময়: ${moment(user.time * 1009).tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A")}\n`;
  });

  msg += "\n\n✅ রিপ্লাই দিন: `add 1` বা `del all`";

  return api.sendMessage(msg, event.threadID, (e, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      listRequest,
      author: event.senderID
    });
  });
};
