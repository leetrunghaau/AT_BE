const fs = require("fs");
const path = require("path");

const storeDir = (user) => {
    const role = Object.keys(user)[0];
    const id = user[role];
    const storePath = path.join(process.cwd(), "public/data/face-data", role, id);
    if (!fs.existsSync(storePath)) {
        fs.mkdirSync(storePath, { recursive: true });
    } else {
        fs.readdirSync(storePath).forEach((file) => {
            fs.unlinkSync(path.join(storePath, file));
        });
    }
    return storePath;
};


function saveImages(images, uploadDir, id) {
    images.forEach((base64, i) => {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const filename = `face_${id}_${i}.jpg`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        if (!fs.existsSync(filepath)) {
            throw new Error(`Failed to save file: ${filename}`);
        }
    });

}
module.exports= {
    storeDir,
    saveImages
}