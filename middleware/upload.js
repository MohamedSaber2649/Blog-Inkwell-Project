import multer from "multer"
import Path from "path"
import crypto from "crypto"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, Path.join(import.meta.dirname, "../uploads"))
    },
    filename: function (req, file, cb) {
        const random = crypto.randomUUID();
        const ext = Path.extname(file.originalname);
        cb(null, random + "-" + file.fieldname + ext)
    }
})
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, })
