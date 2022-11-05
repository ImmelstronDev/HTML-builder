const fsProm = require('fs/promises')
const path = require('path')

const sourcePath = path.join(__dirname, 'files')
const destinationPath = path.join(__dirname, 'copy-files')

const createDir = () => {
    return fsProm.mkdir(destinationPath, {recursive: true})
}

const readDirFiles = () => {
    return fsProm.readdir(sourcePath)
}

const copyFiles = (files) => {
    files.forEach((file) =>  {
        fsProm.copyFile(sourcePath + '/' + file, destinationPath + '/' + file)
        console.log(destinationPath + file)
    })
}

fsProm.rm(destinationPath, {recursive: true, force: true})
    .then(createDir)
    .then(readDirFiles)
    .then(copyFiles)