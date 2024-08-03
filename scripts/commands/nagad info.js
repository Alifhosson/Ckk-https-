module.exports.config = {
  name: "nagad",
  version: "1.0.0",
  permission: 0,
  credits: "°-°",
  prefix: true,
  description: "View Nagad account information",
  category: "Info",
  usages: "{number}",
  cooldowns: 5,
  dependencies: [] // Added this line
};

module.exports.run = async ({ api, event, args }) => {
  const axios = global.nodemodule["axios"];
  let input = args.join(" ");

  try {
    const res = await axios.get(`https://sms-bomb.vercel.app/api/nagad.php?number=${input}`);
    const info = res.data.Info;

    if (!info) {
      return api.sendMessage("No information found for the given number.", event.threadID, event.messageID);
    }

    const { userType: user, name, userId: userid, operator } = info;

    return api.sendMessage(`Name: ${name || 'Not found'}
Number: ${input || '❌'}
Operator: ${operator || '❌'}
User Type: ${user || '❌'}
User ID: ${userid || '❌'}
`, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while fetching data.", event.threadID, event.messageID);
  }
};