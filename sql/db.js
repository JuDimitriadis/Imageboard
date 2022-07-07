const spicedPg = require('spiced-pg');
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
    } = require('../secrets.json');
    db = spicedPg(
        `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
    );
    console.log(`[db] Connecting to: ${DATABASE_NAME}`);
}

function getImages() {
    return db
        .query(
            `SELECT url,  title, id, description, created_at, username, (
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
              ) AS "lowestId" FROM images
              ORDER BY created_at DESC
              LIMIT 3;`
        )
        .then((result) => result.rows);
}

function getMoreImages(lowestIdOnScreen) {
    return db
        .query(
            `SELECT url,  title, id, description, created_at, username, (
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
              ) AS "lowestId" FROM images
              WHERE id < $1
              ORDER BY created_at DESC
              LIMIT 3;`,
            [lowestIdOnScreen]
        )
        .then((result) => {
            return result.rows;
        });
}

function newImage(fileName, username, title, description) {
    const url = 'https://auspic.s3.eu-central-1.amazonaws.com/' + fileName;
    return db
        .query(
            `INSERT INTO images (url, username, title, description) 
        VALUES ($1, $2, $3, $4)
        RETURNING * `,
            [url, username, title, description]
        )
        .then((result) => result.rows[0]);
}

function newComment(image_id, username, comment) {
    return db
        .query(
            `INSERT INTO comments (image_id, username, comment) 
        VALUES ($1, $2, $3)
        RETURNING * `,
            [image_id, username, comment]
        )
        .then((result) => result.rows[0]);
}

function getImageById(id) {
    return db
        .query(
            `SELECT * FROM images
                    WHERE id = $1`,
            [id]
        )
        .then((result) => result.rows);
}

function getComments(imageId) {
    return db
        .query(
            `SELECT * FROM comments
                    WHERE image_id = $1`,
            [imageId]
        )
        .then((result) => result.rows);
}

module.exports = {
    getImages,
    getMoreImages,
    newImage,
    newComment,
    getImageById,
    getComments,
};
