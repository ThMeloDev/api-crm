import * as multer from 'multer';
import * as crypto from 'crypto';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}\\..\\uploads`);
  },
  filename: (req, file, cb) => {
    const cryptoNumber = crypto.randomBytes(16, (err, hash) => {
      if (err) cb(null, err.toString());

      const fileName = `${hash.toString('hex')}-filename${file.originalname}`;
      cb(null, fileName);
    });
  },
});
