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
        cb(null, `${getCurrentTimeStamp()}-File-${file.originalname}`);
    },
});

// const imageFilter = (req: any, file: any, cb: any) => {
//     if (
//         file.mimetype.includes('jpg') ||
//         file.mimetype.includes('jpeg') ||
//         file.mimetype.includes('png')
//     ) {
//         cb(null, true);
//     } else {
//         return cb(
//             new CustomError(
//                 'Please upload only image files.',
//                 StatusCode.BAD_REQUEST,
//             ),
//             false,
//         );
//     }
// };

const imageAndDocFilter = (maxSizeMB: number) => {
    return (req: any, file: any, cb: any) => {
        const allowedMimetypes = [
            // Image types
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',

            // Document types
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-powerpoint', // .ppt
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
            'text/plain', // .txt
        ];

        // Check file type
        if (!allowedMimetypes.includes(file.mimetype)) {
            return cb(
                new CustomError(
                    'Please upload only image or document files.',
                    StatusCode.BAD_REQUEST,
                ),
                false,
            );
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        if (file.size > maxSizeBytes) {
            return cb(
                new CustomError(
                    `File size exceeds the maximum limit of ${maxSizeMB} MB.`,
                    StatusCode.BAD_REQUEST,
                ),
                false,
            );
        }

        // If all checks pass
        cb(null, true);
    };
};

export const UploadFile = multer({
    storage,
    fileFilter: imageAndDocFilter(config.MAX_FILE_SIZE),
});
