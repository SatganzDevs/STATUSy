const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const BodyForm = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
//require("http").createServer((_, res) => res.end("Uptime!")).listen(8080);

const app = express();
const port = process.env.PORT || 3000;
async function UploadFileUgu(input) {
  return new Promise(async (resolve, reject) => {
    const form = new BodyForm();
    form.append("files[]", fs.createReadStream(input));
    await axios({
      url: "https://uguu.se/upload.php",
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        ...form.getHeaders(),
      },
      data: form,
    })
      .then((data) => {
        resolve(data.data.files[0]);
      })
      .catch((err) => reject(err));
  });
}
// Menggunakan middleware untuk menangani unggahan file
const storage = multer.diskStorage({
destination: './views/uploads/', // Adjusted destination path
filename: (req, file, cb) => {
const uniqueId = shortid.generate();
const extension = path.extname(file.originalname);
cb(null, uniqueId + extension);
},
});
const upload = multer({ storage: storage });

// Mengatur tampilan HTML menggunakan EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Adjusted static file serving middleware
app.use('/videos', express.static(path.join(__dirname, 'views', 'uploads')));
app.use('/views', express.static('views'));
app.set('trust proxy', true);

// Function to generate a unique ID
function generateUniqueId() {
return uuidv4();
}



// Menangani permintaan GET ke halaman unggah
app.get('/', (req, res) => {
res.render('index');
});



app.get('/delal', (req, res) => {
const folderPath = path.join(__dirname, 'views', 'uploads');
fs.readdir(folderPath, (err, files) => {
if (err) {
res.send(err)
console.error(err);
} else {
files.forEach((file) => {
const filePath = path.join(folderPath, file);
fs.unlink(filePath, (err) => {
if (err) {
res.send(err)
console.error(err);
} else {
res.send('done!')
console.log(`File ${file} deleted successfully`);
}
});
});
}
});
})



// Endpoint to delete a video
app.get('/delete', (req, res) => {
const videoUrl = req.query.videoUrl;
const videoPath = path.join(__dirname, 'views', 'uploads', videoUrl);
fs.unlink(videoPath, (err) => {
if (err) {
console.error(err);
res.status(500).send('Error deleting video');
} else {
res.send('Video deleted successfully');
}
});
});

// Menangani permintaan POST untuk unggahan video
app.post('/upload', upload.single('file'), async (req, res) => {
let resu = await UploadFileUgu('views/uploads/' + req.file.filename).catch(console.log)
const videoUrl = `https://wa.me/?text=kirim ` + resu.url;
res.redirect(videoUrl);
});


// Menjalankan server
app.listen(port, () => {
console.log(`SatganzDevs Has Connected!`);
});
