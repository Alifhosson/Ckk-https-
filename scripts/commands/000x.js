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
    const ids = Object.keys(event.mentions);
    if (ids.length < 2) {
      return api.sendMessage(`${nn}, You need to tag 2 friends.`, threadID);
    }

    const [id1, id2] = ids;
    const [name1, name2] = await Promise.all([
      Users.getNameUser(id1),
      Users.getNameUser(id2)
    ]);

    try {
      // Fetch the base image
      const { data: baseImageBuffer } = await axios.get('https://i.imgur.com/fJn1yAh.jpeg', {
        responseType: 'arraybuffer',
      });
      const baseImage = await jimp.read(baseImageBuffer);

      // Fetch and load profile pictures
      const [profilePic1, profilePic2] = await Promise.all([
        api.getUserProfilePicture(id1),
        api.getUserProfilePicture(id2)
      ]);

      const [profileImage1, profileImage2] = await Promise.all([
        jimp.read(profilePic1),
        jimp.read(profilePic2)
      ]);

      // Resize profile pictures (if needed) and place them on the base image
      profileImage1.resize(100, 100);
      profileImage2.resize(100, 100);

      baseImage.composite(profileImage1, 50, 50);  // Position (50, 50) for the first user
      baseImage.composite(profileImage2, 200, 50); // Position (200, 50) for the second user

      // Save the final image
      const outputFilePath = `${__dirname}/output/friends_frame_${uid}.jpeg`;
      await baseImage.writeAsync(outputFilePath);

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
