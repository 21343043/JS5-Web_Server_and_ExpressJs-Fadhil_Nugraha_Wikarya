const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const axios = require('axios')

// Mendefinisikan jalur/path untuk konfigurasi Express 
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// Setup direktori statis
app.use(express.static(direktoriPublic))

// Halaman utama
app.get('', (req, res) => {
    res.render('index', {
     judul: 'Aplikasi Cek Cuaca',
     nama: 'Fadhil Nugraha Wikarya'
     })
    })

// Halaman bantuan/FAQ (Frequently Asked Questions)
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
     judul: 'Bantuan',
     nama: 'Fadhil Nugraha Wikarya',
     judulLaman: 'FAQ (Frequently and Question)',
     pertanyaan1: 'A. Halaman ini digunakan untuk apa?',
     jawaban1: 'Halaman bantuan ini berisi tentang FAQ (Frequently and Question) yang dapat membantu pengunjung website atau aplikasi untuk menemukan jawaban atas pertanyaan mereka dengan cepat dan mudah, sehingga meningkatkan pengalaman pengguna',
     pertanyaan2: 'B. Apa itu API?',
     jawaban2: 'API adalah singkatan dari Application Programming Interface. Ini adalah antarmuka yang memungkinkan dua atau lebih program komputer untuk berkomunikasi satu sama lain. ',
     pertanyaan3: 'C. API apa yang digunakan dalam aplikasi ini?',
     jawaban3: 'API yang digunakan dalam aplikasi ini yaitu weatherstack dan mediastack',
     pertanyaan4: 'D. Salah satu pola arsitektur API adalah REST (Representational State Transfer)',
     jawaban4: 'REST API adalah singkatan dari Representational State Transfer Application Programming Interface. REST sendiri merupakan standar arsitektur bebbasis web yang menggunakan protokol HTTP ketika ingin berkomunikasi data. Sementara, API adalah protokol yang bisa digunakan antar aplikasi untuk saling berkomunikasi satu dengan yang lainnya. Fungsinya ini bertukar data antar aplikasi meski tidak terhubung secara langsung.',
     })
    })

// Halaman infoCuaca
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address : req.query.address
            })
        })
    })
})

// Halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
     judul: 'Tentang Saya',
     nama: 'Fadhil Nugraha Wikarya'
     })
    })

// Halaman berita
app.get('/berita', async (req, res) => {
    try {
        const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
        const apiKey = '0694ccf0059d61fc61e9924bc4f70f59';

        const params = {
            access_key: apiKey,
            countries: 'id', 
        };

        const response = await axios.get(urlApiMediaStack, { params });
        const dataBerita = response.data;

        res.render('berita', {
            nama: 'Fadhil Nugraha Wikarya',
            judul: 'Berita',
            berita: dataBerita.data,
        });
    } catch (error) {
        console.error(error);
        res.render('error', {
            judul: 'Terjadi Kesalahan',
            pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
    });
}
});

app.listen(4000, () => {
console.log('Server berjalan pada port 4000.')
})
