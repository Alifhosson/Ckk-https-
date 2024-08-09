const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const Jimp = require('jimp');

module.exports.config = {
  name: "b",
  version: "1.0.0",
  permission: 0,
  credits: "Nayan",
  description: "",
  prefix: true,
  category: "Love",
  usages: "b @",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const dir = __dirname;
  const cachePath = path.resolve(dir, 'cache');
  const imagePath = path.resolve(dir, 'cache', 'ewhd.png');

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
  }

  if (!fs.existsSync(imagePath)) {
    const imageUrl = 'https://i.imgur.com/YAc0hB3.jpeg';
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(imagePath, Buffer.from(response.data));
  }
};

async function makeImage({ one, two }) {
  const dir = __dirname;
  const imagePath = path.resolve(dir, 'cache', 'ewhd.png');

  const baseImage = await Jimp.read(imagePath);
  const userAvatarPath = path.resolve(dir, `cache/avt_${one}.png`);
  const mentionedAvatarPath = path.resolve(dir, `cache/avt_${two}.png`);

  // Ensure avatars are fetched and processed
  const userAvatar = await Jimp.read(userAvatarPath);
  const mentionedAvatar = await Jimp.read(mentionedAvatarPath);

  // Your image processing logic here, for example:
  baseImage
    .composite(userAvatar.resize(100, 100), 10, 10)
    .composite(mentionedAvatar.resize(100, 100), 200, 10);

  // Save the final image
  const outputPath = path.resolve(dir, 'cache', 'final_image.png');
  await baseImage.writeAsync(outputPath);

  return outputPath;
}
