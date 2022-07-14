const express = require('express');
const app = express();
const db = require('./sql/db.js');
const multer = require('./midleware.js');
const s3 = require('./s3.js');

app.use(express.static('./public'));

app.use(express.json());

app.get('/images.json', (req, res) => {
    db.getImages().then((result) => {
        if (!result) {
            res.json({ success: false });
        } else {
            // res.json({ success: true });
            res.json(result);
        }
    });
});

app.get('/moreImages/:lowestID', (req, res) => {
    db.getMoreImages(req.params.lowestID).then((result) => {
        res.json(result);
    });
});

app.post('/upload', multer.uploader.single('file'), s3.upload, (req, res) => {
    const { username, title, description } = req.body;
    if (req.file) {
        db.newImage(req.file.filename, username, title, description).then(
            (result) => {
                res.json(result);
            }
        );
    } else {
        res.json({ success: false });
    }
});

app.post('/new-comment', (req, res) => {
    const { img_id, userComment, comment } = req.body;
    db.newComment(img_id, userComment, comment)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log('ops DB insert did not work', error);
            res.json({ success: false });
        });
});

app.get('/image/:id', (req, res) => {
    db.getImageById(req.params.id).then((result) => {
        if (!result) {
            res.status(404).json({
                message: 'Image not found',
            });
            return;
        }
        res.json(result);
    });
});

app.get('/get-comments/:id', (req, res) => {
    // console.log('getting comments');
    db.getComments(req.params.id).then((result) => {
        if (!result) {
            // console.log('commenst not found');
            res.status(404).json({
                message: 'Coments not found',
            });
            return;
        }
        // console.log('commenst here', result);
        res.json(result);
    });
});

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`I'm listening to image board....`)
);
