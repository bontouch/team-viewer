const axios = require("axios");

const getHiBobEmployees = async () => {
  const authKey = btoa(
    `${process.env.HIBOB_SERVICE_USER_ID}:${process.env.HIBOB_SERVICE_USER_TOKEN}`
  );
  try {
    const response = await axios.post(
      "https://api.hibob.com/v1/people/search",
      { humanReadable: "REPLACE" },
      {
        headers: {
          Authorization: `Basic ${authKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response");
    return response.data.employees;
  } catch (e) {
    console.log("error");
    console.error(e);
  }
};

module.exports = getHiBobEmployees;
