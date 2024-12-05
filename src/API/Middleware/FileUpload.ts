import multer from 'multer';
import multerS3 from 'multer-s3';
import { CustomError } from '@application/error';
import { getCurrentTimeStamp, StatusCode } from '@application/utilities';
import { FIleStorage } from '@infrastructure/FileStorage';
import config from '@application/config';

const s3 = new FIleStorage().getConnection();

// File Upload
const storage = multerS3({
    s3,
    acl: 'public-read',
    bucket: config.S3.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file: any, cb: any) => {
        cb(null, `${getCurrentTimeStamp()}-Image-${file.originalname}`);
    },
});

const imageFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png')
    ) {
        cb(null, true);
    } else {
        return cb(
            new CustomError(
                'Please upload only image files.',
                StatusCode.BAD_REQUEST,
            ),
            false,
        );
    }
};

export const UploadFile = multer({ storage, fileFilter: imageFilter });
