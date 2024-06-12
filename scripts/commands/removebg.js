module.exports = {
config: {
    name: "removebg",
    version: "1.0.0",
    permission: 0,
    credits: "Nayan",
    description: "Background Remove",
    prefix: true,
    category: "prefix",
    usages: "reply",
    cooldowns: 10,
    dependencies: {
       'nayan-server': '2.3.6'
    }
},

start: async function({ nayan, events, args, NAYAN }) {
    const axios = require("axios")
    const request = require("request")
    const fs = require("fs-extra")
    const {removebg} = require('nayan-server')
          if (events.type !== "message_reply") return nayan.reply("[⚜️]➜ You must reply to a photo", events.threadID, events.messageID);
        if (!events.messageReply.attachments || events.messageReply.attachments.length == 0) return nayan.reply("[⚜️]➜ You must reply to a photo", events.threadID, events.messageID);
        if (events.messageReply.attachments[0].type != "photo") return nayan.reply("[⚜️]➜ This is not an image", events.threadID, events.messageID);
  const content = (events.type == "message_reply") ? events.messageReply.attachments[0].url : args.join("⏳️");

const res = await removebg(content)
  console.log(res)
  const img1 = res.data
        var msg = [];

  let imgs1 = (await axios.get(`${img1}`, {
    responseType: 'arraybuffer'
  })).data;
  fs.writeFileSync(__dirname + "/cache/removebg.jpg", Buffer.from(imgs1, "utf-8"));
  var allimage = [];
  allimage.push(fs.createReadStream(__dirname + "/cache/removebg.jpg"));

        {
            msg += `🖼️=== [ REMOVED BACKGROUND ] ===🖼️`
        }
NAYAN.react("✔️")
        return nayan.reply({
            body: msg,
            attachment: allimage 

        }, events.threadID, events.messageID);
}
}
