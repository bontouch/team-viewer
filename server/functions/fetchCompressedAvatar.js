const { ref, getBytes, getStorage } = require("firebase/storage");
const { error } = require("firebase-functions/logger");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("./firebaseConfig.json");

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const fetchCompressedAvatar = async (id) => {
  try {
    const imageBaseUrl = "avatars";
    const storageRef = ref(storage, `${imageBaseUrl}/${id}`);
    const bytes = await getBytes(storageRef);
    const imageBuffer = Buffer.from(bytes, "binary");
    const thumbnailBase64 = imageBuffer.toString("base64");
    return `data:image/webp;base64,${thumbnailBase64}`;
  } catch (e) {
    error(`${e}: was not able to retrieve image for ${id}!`);
  }
};

module.exports = fetchCompressedAvatar;
