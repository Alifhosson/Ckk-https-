module.exports.config = {
  name: "anika",
  version: "2.0.0",
  permission: 0,
  credits: "Nayan",
  description: "Talk to sim",
  prefix: false,
  category: "sim",
  usages: "[ask]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    let { messageID, threadID } = event;
    let tid = threadID;
    let mid = messageID;

    // Check if the user provided any message to ask
    if (!args[0]) {
        return api.sendMessage("hmm Jan Umma 😚🌚 ...", tid, mid);
    }

    const content = encodeURIComponent(args.join(" "));

    try {
        // Correct API URL
        const res = await axios.get(`http://37.27.114.136:25472/sim?type=ask&ask=${content}&lang=bn&filter=false`);
        const responseText = res.data.success;

        // Handle API errors
        if (res.data.error) {
            return api.sendMessage(`Error: ${res.data.error}`, tid, mid);
        }

        // Ensure responseText is defined before sending it
        if (responseText) {
            api.sendMessage(responseText, tid, mid);
        } else {
            api.sendMessage("No response received from the server.", tid, mid);
        }
    } catch (error) {
        // Handle any errors during the HTTP request
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", tid, mid);
    }
};
