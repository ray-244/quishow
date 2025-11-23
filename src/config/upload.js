const multer = require("multer");
const path = require("path");

const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  console.log(`Criando diretório de uploads: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        extension
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
