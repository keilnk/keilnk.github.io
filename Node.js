const express = require('express');
const app = express();

let viewerCount = 0;

app.use(express.static(__dirname)); // Statische Dateien ausliefern

app.get('/', (req, res) => {
    viewerCount++;
    res.sendFile(__dirname + '/index.html');
});

app.get('/getViewerCount', (req, res) => {
    res.send(viewerCount.toString());
});

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});
