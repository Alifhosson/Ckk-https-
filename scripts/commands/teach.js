const axios = require("axios");

module.exports.config = { 
  name: "teach",
  version: "0.0.2",
  permission: 0,
  prefix: 'awto',
  credits: "Rahad",
  description: "Teach sim",
  category: "admin",
  usages: "hi = hello",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const input = args.join(" ").split("=>");

    if (input.length < 2) {
        if (args.length === 0) {
            return api.sendMessage("Usage: teach [ask] => [answer]", threadID);
        } else if (args.join(" ").includes("=")) {
            return api.sendMessage("Please provide both a question and an answer.", threadID);
        } else {
            return api.sendMessage("Please use '=>' character to separate the question and answer.", threadID);
        }
    }

    const teachQuery = input[0].trim();
    const ansQuery = input[1].trim();

    try {
        const response = await axios.get(`https://simsimi.fun/api/v2/?mode=teach&lang=bn&message=${encodeURIComponent(teachQuery)}&answer=${encodeURIComponent(ansQuery)}`);

        if (response.status >= 200 && response.status < 300) {
            api.sendMessage({ 
              body: `📝 Your Data Added To Database Successfully\n1️⃣ ASK: ${teachQuery}\n2️⃣ ANS: ${ansQuery}`, 
              threadID, 
              messageID
            });
        } else {
            api.sendMessage("An error occurred while teaching.", threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", threadID);
    }
};