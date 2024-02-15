const axios = require("axios");
const sharp = require("sharp");
sharp.cache(false);

const fetchAndCompressImage = async (url, size) => {
  const width = size ? Number(size) : 160;
  const authKey = btoa(
    `${process.env.HIBOB_SERVICE_USER_ID}:${process.env.HIBOB_SERVICE_USER_TOKEN}`
  );
  const hiBobImage = await axios.get(url, {
    headers: {
      Authorization: authKey,
    },

    responseType: "arraybuffer",
  });

  const imageBuffer = Buffer.from(hiBobImage.data, "binary");
  const metadata = await sharp(imageBuffer).metadata();
  const aspectRatio = metadata.width / metadata.height;
  const height = Math.round(width / aspectRatio);

  return await sharp(imageBuffer)
    .resize(width, height)
    .webp({ quality: 100 })
    .toBuffer();
};

module.exports = fetchAndCompressImage;
