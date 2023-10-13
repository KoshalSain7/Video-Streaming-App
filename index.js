const express = require('express');
const fs = require('fs')
const app = express()
const port = 6969;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Range Not Found!");
    }
    const videoPath = 'Video.mp4';
    const videoSize = fs.statSync('Video.mp4').size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});



app.listen(port, () => {
    console.log(`Server Running at ${port}`);
})