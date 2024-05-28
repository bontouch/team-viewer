const axios = require("axios");

const getSlackMembersList = async () => {
  try {
    const response = await axios.get(
      "https://slack.com/api/users.list?pretty=1",
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_OAUTH_TOKEN}`,
          accept: "application/json",
        },
      }
    );
    return response?.data?.members ?? [];
  } catch (e) {
    console.error(e);
  }
};

module.exports = getSlackMembersList;
