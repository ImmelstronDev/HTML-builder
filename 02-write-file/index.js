const path = require('path');
const fs = require('fs');
const {stdin, stdout, exit} = process;


stdout.write('write your message in terminal / напишите свое сообщение в терминал\n')
const output = fs.createWriteStream(path.resolve(__dirname, 'output.txt'))

stdin.on('data', data => {
    const utfData = Buffer.from(data).toString().trim()
    
    if(utfData === 'exit'){
        console.log('GG WP!');
        exit();
    }

    output.write(utfData + '\n')

})

process.on('SIGINT', () => {
    console.log('GG WP!');
    exit();
})