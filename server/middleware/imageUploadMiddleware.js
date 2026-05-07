import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists (in project root)
const uploadDir = path.resolve(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `event-${crypto.randomUUID()}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only images (jpg, png, webp) are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

export default upload
