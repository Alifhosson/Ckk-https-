module.exports.config = {
  name: "anika",
  version: "2.0.0",
  permission: 0,
  credits: "Nayan",
  description: "talk to sim",
  prefix: false,
  category: "sim",
  usages: "[ask]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    let { messageID, threadID } = event;

    if (!args[0]) return api.sendMessage("hmm Jan Umma 😚🌚 ...", threadID, messageID);

    const content = encodeURIComponent(args.join(" "));
    
    try {
        const res = await axios.get(`http://37.27.114.136:25472/sim?type=ask&ask=bn&message=${content}&filter=false`);
        
        if (res.data.error) {
            return api.sendMessage(`Error: ${res.data.error}`, threadID, messageID);
        }

        const respond = res.data.success;
        api.sendMessage(respond, threadID, messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", threadID, messageID);
    }
};
