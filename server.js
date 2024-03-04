const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const shortid = require('shortid');
const path = require('path');
const app = express();
const port = 3000;



async function uploadToUguu(videoData) {
    try {
        const response = await axios.post('https://uguu.se/upload.php', videoData, {
            headers: {
                'Content-Type': 'video/mp4', // Sesuaikan dengan jenis konten video yang Anda kirim
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

// Mengatur tampilan HTML menggunakan EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static('views'));
app.set('trust proxy', true);
app.use(express.json({ limit: '50mb' }));



// Menangani permintaan GET ke halaman unggah
app.get('/', (req, res) => {
res.render('index');
});




// Endpoint untuk mengunggah video ke Uguu
app.post('/upload', async (req, res) => {
    try {
        // Ambil data video dari body permintaan
        const videoData = req.body.videoData;

        // Unggah video ke Uguu
        const uguuResponse = await uploadToUguu(videoData);

        // Buat URL untuk video yang diunggah
        const videoUrl = `https://wa.me/6281268248904?text=kirim ${uguuResponse.url}`;

        // Kirim URL video sebagai respons
        res.send(videoUrl);
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).send('Error uploading video');
    }
});


// Menjalankan server
app.listen(port, () => {
console.log(`SatganzDevs Has Connected!`);
});
