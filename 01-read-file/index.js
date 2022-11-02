const path = require('path');
const fs = require('fs');

const input = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
input.on('data', chunk => console.log(chunk));
