const fsProm = require('fs/promises')
const path = require('path')
const fs = require('fs')

const sourcePath = path.join(__dirname, 'styles')
const destinationPath = path.join(__dirname, 'project-dist/bundle.css')


const foundFiles = () => fsProm.readdir(sourcePath)

const filteredFiles = (files) => files.filter((file) => path.extname(path.join(sourcePath, file)) === '.css')

const readingFiles = (files) => Promise.all(files.map(file => fsProm.readFile(path.join(sourcePath, file),'utf-8')))

const packageBundle = (arr) => {
    const output = fs.createWriteStream(destinationPath, {flags: 'w'})
    arr.forEach((fileData) => output.write(fileData + '\n'))
}


fsProm.rm(destinationPath, {recursive: true, force: true})
    .then(foundFiles)
    .then(filteredFiles)
    .then(readingFiles)
    .then(packageBundle)