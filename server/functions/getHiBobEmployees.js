const axios = require('axios');

const getHiBobEmployees = async () => {
  try {
    const response = await axios.get(
      'https://api.hibob.com/v1/people?humanReadable=true&includeHumanReadable=false',
      {
        headers: {
          Authorization: process.env.HIBOB_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.employees;
  } catch (e) {
    console.error(e);
  }
};

module.exports = getHiBobEmployees;
