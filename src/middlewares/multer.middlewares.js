import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.resolve("Public/temp");

console.log("MULTER TEMP DIR:", tempDir);

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("MULTER DESTINATION:", tempDir);
    cb(null, tempDir);
  },

  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;

    console.log("MULTER FILENAME:", filename);

    cb(null, filename);
  },
});

export const upload = multer({ storage });