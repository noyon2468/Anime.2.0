//learn to eat, learn to speak, don't learn the habit of replacing cre 
module.exports.config = {
	name: "googlebar",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "নূর মোহাম্মদ + ChatGPT",
	description: "গুগল বোর্ডে কমেন্ট লিখে ইমেজ বানায় ( ͡° ͜ʖ ͡°)",
	commandCategory: "edit-img",
	usages: "googlebar [text]",
	cooldowns: 10,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.wrapText = (ctx, text, maxWidth) => {
	return new Promise(resolve => {
		if (ctx.measureText(text).width < maxWidth) return resolve([text]);
		if (ctx.measureText('W').width > maxWidth) return resolve(null);
		const words = text.split(' ');
		const lines = [];
		let line = '';
		while (words.length > 0) {
			let split = false;
			while (ctx.measureText(words[0]).width >= maxWidth) {
				const temp = words[0];
				words[0] = temp.slice(0, -1);
				if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
				else {
					split = true;
					words.splice(1, 0, temp.slice(-1));
				}
			}
			if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
			else {
				lines.push(line.trim());
				line = '';
			}
			if (words.length === 0) lines.push(line.trim());
		}
		return resolve(lines);
	});
}

module.exports.run = async function ({ api, event, args, Users }) {
	const { loadImage, createCanvas } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];

	let { senderID, threadID, messageID } = event;
	let pathImg = __dirname + '/cache/googlebar.png';
	let text = args.join(" ");
	if (!text) return api.sendMessage("❌ দয়া করে লিখুন কি কমেন্ট করবেন বোর্ডে!", threadID, messageID);

	const templateURL = "https://i.imgur.com/GXPQYtT.png"; // গুগলবার টেমপ্লেট

	// ডাউনলোড ও লোড
	let imageRaw = (await axios.get(templateURL, { responseType: 'arraybuffer' })).data;
	fs.writeFileSync(pathImg, Buffer.from(imageRaw, 'utf-8'));
	let baseImage = await loadImage(pathImg);
	let canvas = createCanvas(baseImage.width, baseImage.height);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

	// ফন্ট সেটিংস
	ctx.font = "400 30px Arial";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";

	// ফন্ট ছোট করে নেওয়া
	let fontSize = 50;
	while (ctx.measureText(text).width > 1200) {
		fontSize--;
		ctx.font = `400 ${fontSize}px Arial`;
	}

	// লাইন wrap
	const lines = await this.wrapText(ctx, text, 470);
	ctx.fillText(lines.join('\n'), 580, 646); // কমেন্ট পজিশন

	// শেষ কাজ
	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(pathImg, imageBuffer);

	// ইউজার নাম
	let userName = await Users.getNameUser(senderID);

	return api.sendMessage({
		body: `📝 ${userName} এই লিখেছে গুগল বোর্ডে:\n“${text}”`,
		attachment: fs.createReadStream(pathImg)
	}, threadID, () => fs.unlinkSync(pathImg), messageID);
};
