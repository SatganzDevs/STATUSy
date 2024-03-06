const express = require('express');
const admin = require('firebase-admin');
const { getDownloadURL } = require('firebase-admin/storage');
const bodyParser = require('body-parser');
const multer = require('multer'); 
const path = require('path');
const serviceAccount = require('./admin.json');

const app = express();
const port = 3000;


admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
storageBucket: 'video-uploader-satzz.appspot.com' 
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static('views'));
app.set('trust proxy', true);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
async function deleteOldFiles() {
try {
const bucket = admin.storage().bucket();
const [files] = await bucket.getFiles();
const currentTime = Date.now();
const maxAge = 3 * 60 * 60 * 1000;
for (const file of files) {
const [metadata] = await file.getMetadata();
const creationTime = new Date(metadata.timeCreated).getTime();
if (currentTime - creationTime > maxAge) {
await file.delete();
console.log(`File ${file.name} telah dihapus.`);
}
}
} catch (error) {
console.error('Error deleting old files:', error);
}
}

deleteOldFiles();

app.get('/', (req, res) => {
res.render('index');
});


app.post('/upload', upload.single('file'), async (req, res) => {
try {
const videoData = req.file.buffer; 
const fileName = new Date().toISOString() + '.mp4';
const bucket = admin.storage().bucket();
const file = bucket.file(fileName);
await file.save(videoData, {
metadata: {
contentType: 'video/mp4' 
}
});
const url = await getDownloadURL(file);
res.redirect('https://wa.me/6281268248904?text=.send ' + url);
} catch (error) {
console.error('Error uploading video:', error);
res.status(500).send('Error uploading video');
}
});

// Menjalankan server
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
