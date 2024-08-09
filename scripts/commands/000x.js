const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs');

module.exports.config = {
  name: "m",
  version: "1.0.0",
  permssion: 0,
  credits: "Mohammad Nayan",
  description: "friends photo frame",
  category: "friends",
  prefix: true,
  cooldowns: 2,
};

module.exports.run = async function({ api, event, args, Users, threadID }) {
  const uid = event.senderID;
  const info = args.join(" ");
  const nn = await Users.getNameUser(uid);

  if (!info) {
    return api.sendMessage(`${nn}, Please Tag Your 2 Friends`, threadID);
  } else {
    const id = Object.keys(event.mentions)[0] || uid;
    const ids = Object.keys(event.mentions)[1] || uid;

    const name = await Users.getNameUser(id);
    const name2 = await Users.getNameUser(uid);
    const name3 = await Users.getNameUser(ids);

    try {
      // Fetch the image from the URL
      const { data: imageBuffer } = await axios.get('https://i.imgur.com/fJn1yAh.jpeg', {
        responseType: 'arraybuffer',
      });

      // Load the image with jimp
      const image = await jimp.read(imageBuffer);

      // Perform image manipulations here if needed (e.g., overlay user photos)
      
      // Save or process the image
      const outputFilePath = `${__dirname}/output/friends_frame_${uid}.jpeg`;
      await image.writeAsync(outputFilePath);

      // Send the image back to the user
      return api.sendMessage(
        {
          body: `Here's your friend frame, ${nn}!`,
          attachment: fs.createReadStream(outputFilePath)
        },
        threadID
      );
    } catch (error) {
      console.error('Error processing the image:', error);
      return api.sendMessage('Something went wrong while processing the image.', threadID);
    }
  }
};
