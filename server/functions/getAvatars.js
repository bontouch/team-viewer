const getHiBobEmployees = require("./getHiBobEmployees");
const fetchCompressedAvatar = require("./fetchCompressedAvatar");
const { error } = require("firebase-functions/logger");
const getAvatars = () => async () => {
  try {
    const employees = await getHiBobEmployees();
    const avatars = {};
    await Promise.allSettled(
      employees.map(async (employee) => {
        const avatarUrl = employee?.about?.avatar || employee.avatarUrl;
        if (avatarUrl && !avatarUrl.toLowerCase().includes("default-avatars")) {
          const avatarDataUrl = await fetchCompressedAvatar(employee.id);
          avatars[employee.id] = avatarDataUrl;
        }
      })
    );
    return avatars;
  } catch (e) {
    error(e);
  }
};

module.exports = getAvatars;
