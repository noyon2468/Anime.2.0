// Auto Islamic Azan Notifier with Owner UID Protection
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "autotime",
  version: "2.0",
  hasPermssion: 0,
  credits: "CYBER ☢️ TEAM × Nur Muhammad",
  description: "⏰ Send Islamic azan messages with image based on time automatically!",
  commandCategory: "system",
  countDown: 3
};

module.exports.onLoad = async ({ api }) => {
  const ownerUID = "100035389598342"; // Nur Muhammad UID

  const azanTimes = {
    "05:35 AM": {
      message: "🕋 ফজরের আজান দেওয়া হয়েছে! সবাই নামাজের প্রস্তুতি নিন।",
      url: "https://drive.google.com/uc?id=1m5jiP4q9IpA1wH-eSrVKZo6iI7GJGRc2P9joj2kby&export=download"
    },
    "01:00 PM": {
      message: "🕌 জোহরের আজান দেওয়া হয়েছে। নামাজের প্রস্তুতি নিন।",
      url: "https://drive.google.com/uc?id=1mB8EpEEbSpTIQSpw0qAlkvtqaxH64EQR1gTYY&export=download"
    },
    "04:30 PM": {
      message: "🌞 আসরের আজান দেওয়া হয়েছে। নামাজ আদায় করুন।",
      url: "https://drive.google.com/uc?id=1mkNnhFFvtazzVKZo6iI7GJGRc2P9joj2kby&export=download"
    },
    "07:05 PM": {
      message: "🌇 মাগরিবের আজান হয়েছে! দয়া করে নামাজ পড়ুন।",
      url: "https://drive.google.com/uc?id=1mNVwfsTENtbse57h2SG2ayqAlkvtqaxH&export=download"
    },
    "08:15 PM": {
      message: "🌙 ইশার আজান হয়েছে, নামাজ শুরু করুন।",
      url: "https://drive.google.com/uc?id=1mP2HJlKRwuMpb1MMj7FPqDbIX4BoqAlkvtqaxH&export=download"
    }
  };

  async function checkAndSendAzan() {
    const now = new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Dhaka",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit"
    });

    const timeKey = now.trim();

    if (azanTimes[timeKey]) {
      const { message, url } = azanTimes[timeKey];
      console.log(`🕌 Sending azan message for: ${timeKey}`);

      try {
        const imageRes = await axios.get(url, { responseType: "stream" });

        const msg = {
          body: message,
          attachment: imageRes.data
        };

        global.allThreadID.forEach(threadID => {
          api.sendMessage(msg, threadID);
        });
      } catch (err) {
        console.error(`❌ Error sending azan at ${timeKey}:`, err);
      }
    }

    setTimeout(checkAndSendAzan, 60 * 1000); // check every minute
  }

  checkAndSendAzan();
};

module.exports.run = ({ api, event }) => {
  const allowedUID = "100035389598342";
  if (event.senderID !== allowedUID)
    return api.sendMessage("❌ এই কমান্ডটি কেবলমাত্র নূর মোহাম্মদ ব্যবহার করতে পারবেন।", event.threadID);

  return api.sendMessage("✅ Islamic Azan Auto System চালু হয়েছে এবং প্রতি নামাজের সময় মেসেজ পাঠাবে ইনশাআল্লাহ।", event.threadID);
};
