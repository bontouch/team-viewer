const axios = require("axios");

const getHiBobWhosOutToday = async () => {
  const authKey = btoa(
    `${process.env.HIBOB_SERVICE_USER_ID}:${process.env.HIBOB_SERVICE_USER_TOKEN}`
  );
  try {
    const response = await axios.get(
      "https://api.hibob.com/v1/timeoff/outtoday",
      {
        headers: {
          Authorization: `Basic ${authKey}`,
          accept: "application/json",
        },
      }
    );
    return response.data.outs;
  } catch (e) {
    console.error(e);
  }
};

module.exports = getHiBobWhosOutToday;
