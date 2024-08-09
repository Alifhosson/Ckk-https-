const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports.config = {
  name: "m",
  version: "1.0.0",
  permission: 0,
  credits: "Alif Hosson",
  description: "friends photo frame",
  category: "friends",
  prefix: true,
  cooldowns: 2,
};

module.exports.run = async function({ api, event, args, Users, threadID }) {
  
  const uid = event.senderID;
  const info = args.join(" ");
  
  if (!info) {
    const userName = await Users.getNameUser(uid);
    return api.sendMessage(`${userName}, please tag your 2 friends.`, threadID);
  }
  
  const mentionedUserIds = Object.keys(event.mentions);
  if (mentionedUserIds.length < 2) {
    return api.sendMessage(`Please tag exactly 2 friends.`, threadID);
  }

  const [id1, id2] = mentionedUserIds;
  const name1 = await Users.getNameUser(id1);
  const name2 = await Users.getNameUser(uid);
  const name3 = await Users.getNameUser(id2);
  
  api.sendMessage(`Processing your Image, please wait...`, threadID, (err, info) => {
    if (err) return console.error(err);
    setTimeout(() => { api.unsendMessage(info.messageID); }, 5000);
  });

  try {
    // Retrieve profile picture URLs
    const pic1 = `https://graph.facebook.com/${id1}/picture?type=large`;
    const pic2 = `https://graph.facebook.com/${uid}/picture?type=large`;
    const pic3 = `https://graph.facebook.com/${id2}/picture?type=large`;

    // Load images using jimp
    const [image1, image2, image3, frame] = await Promise.all([
      jimp.read(pic1),
      jimp.read(pic2),
      jimp.read(pic3),
      jimp.read('https://i.imgur.com/fJn1yAh.jpeg')
    ]);

    // Resize images to fit within the frame (example sizes)
    image1.resize(150, 150);
    image2.resize(150, 150);
    image3.resize(150, 150);

    // Composite the images onto the frame
    frame.composite(image1, 50, 50);
    frame.composite(image2, 250, 50);
    frame.composite(image3, 450, 50);

    // Save the final image
    const outputPath = `./temp/friends_${uid}.png`;
    await frame.writeAsync(outputPath);

    // Send the final image
    api.sendMessage({
      body: `Here's your friends photo frame!`,
      attachment: fs.createReadStream(outputPath)
    }, threadID, () => fs.unlinkSync(outputPath)); // Clean up

  } catch (err) {
    console.error(err);
    api.sendMessage(`Failed to process the image. Please try again later.`, threadID);
  }
};
