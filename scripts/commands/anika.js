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

    // Check if user provided any message to ask
    if (!args[0]) {
        return api.sendMessage("hmm Jan Umma 😚🌚 ...", tid, mid);
    }

    const content = encodeURIComponent(args.join(" "));

    try {
        // Make sure the API URL is correct
        const res = await axios.get(`http://37.27.114.136:25472/sim?type=ask&ask=${content}&lang=bn&filter=false`);
        const responseText = res.data.success;

        if (res.data.error) {
            // Handle API errors
            api.sendMessage(`Error: ${res.data.error}`, tid, (error) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        } else {
            // Send the response back to the user
            api.sendMessage(responseText, tid, (error) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        }
    } catch (error) {
        // Handle any errors during the HTTP request
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", tid, mid);
    }
};
