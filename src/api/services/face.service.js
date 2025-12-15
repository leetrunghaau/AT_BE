const axios = require('axios');
const FormData = require('form-data');
const { AI_ENDPOINTS } = require('@/src/config/constants');
const createError = require('http-errors');

class FaceService {
    async registerUser(userId, images, landmarks) {
        const form = new FormData();
        images.forEach((base64, i) => {
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const filename = `face_${i}.jpg`;
            form.append('files', buffer, { filename: filename });
        });
        form.append('landmarks', JSON.stringify(landmarks))
        form.append('user_id', userId);
        try {
            const res = await axios.post(AI_ENDPOINTS.REGISTER, form, {
                headers: form.getHeaders(),
                timeout: 10000
            });
            return res.data
        } catch (err) {

            throw createError.NotFound('Server AI khoogn hoạt động');
        }


    }

    async recognize(image, landmarks) {
        const form = new FormData();
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const filename = `face.jpg`;
        form.append('file', buffer, { filename: filename });
        form.append('landmarks', JSON.stringify(landmarks))
        try {
            const res = await axios.post(AI_ENDPOINTS.RECOGNIZE, form, {
                headers: form.getHeaders(),
                timeout: 10000
            });
            return res.data
        } catch (err) {

            throw createError.NotFound('Server AI không hoạt động');
        }
    }

}

module.exports = new FaceService();
