const getHiBobEmployees = require('../getHiBobEmployees');
const { ref, getStorage, uploadBytes } = require('firebase/storage');
const firebaseConfig = require('../firebaseConfig.json');
const { initializeApp } = require('firebase/app');
const fetchAndCompressImage = require('./fetchAndCompressImage');
const { error, log } = require('firebase-functions/logger');

const resizeAndStoreImagesFromHiBob = async () => {
    try {
        const imageBaseUrl = 'avatars';
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const employees = await getHiBobEmployees();

        await Promise.all(
            employees.map(async (employee, index) => {
                const employeeId = employee.id;
                const imageRef = `${imageBaseUrl}/${employeeId}`;
                const avatarUrl = employee?.about?.avatar || employee.avatarUrl;
                if (
                    avatarUrl &&
                    !avatarUrl.toLowerCase().includes('default-avatars')
                ) {
                    try {
                        log(`${index}: ${employee.fullName} start`);
                        const storageRef = ref(storage, imageRef);
                        const compressedImageBuffer =
                            await fetchAndCompressImage(avatarUrl);
                        await uploadBytes(storageRef, compressedImageBuffer);
                        log(`${index}: ${employee.fullName} end`);
                    } catch (e) {
                        error(
                            `${e}: failed to compress and save for ${imageRef}: ${employee.fullName}`
                        );
                    }
                }
            })
        );
    } catch (e) {
        error(`${e}: was not able to resize and store images!`);
    }
};

module.exports = resizeAndStoreImagesFromHiBob;
