const fsProm = require('fs/promises')
const path = require('path')
const fs = require('fs')

const destinationPath = path.join(__dirname, 'project-dist')
const sourceStylesPath = path.join(__dirname, 'styles')
const sourceAssetsPath = path.join(__dirname, 'assets')


const createDir = () => fsProm.mkdir(destinationPath, {recursive: true})

const createCssFile = () => {
    const destinationCSS = path.join(destinationPath, 'style.css');

    const foundFiles = () => fsProm.readdir(sourceStylesPath)

    const filteredFiles = (files) => files.filter((file) => path.extname(path.join(sourceStylesPath, file)) === '.css')

    const readingFiles = (files) => Promise.all(files.map(file => fsProm.readFile(path.join(sourceStylesPath, file),'utf-8')))

    const packageBundle = (arr) => {
    const output = fs.createWriteStream(destinationCSS, {flags: 'w'})
    arr.forEach((fileData) => output.write(fileData + '\n'))
    }

    fsProm.rm(destinationCSS, {recursive: true, force: true})
    .then(foundFiles)
    .then(filteredFiles)
    .then(readingFiles)
    .then(packageBundle)
}

const copyDirectoryAssets = async () => {
    const destinationAssets = path.join(destinationPath, 'assets')

    await fsProm.rm(destinationAssets, {recursive: true, force: true})

    await fsProm.mkdir(destinationAssets, {recursive: true})

    const sourceInnerDirNames = await fsProm.readdir(sourceAssetsPath)

    const destAssetsDirs = await Promise.all(sourceInnerDirNames.map((folder) => fsProm.mkdir(path.join(destinationAssets, folder))))

    const dirFiles = await Promise.all(sourceInnerDirNames.map(dirName => fsProm.readdir(path.join(sourceAssetsPath, dirName))))

    const promises = []

    for(let i = 0; i < sourceInnerDirNames.length; i++) {
        const files = dirFiles[i]
        const source = sourceInnerDirNames[i]


        for(let j = 0;j < files.length; j++) {
            const fileName = files[j]
            const sourceFile = path.join(path.join(sourceAssetsPath, source), fileName)
            const destinationFile = path.join(path.join(destinationAssets, source), fileName)
            const copyInfo = {
                source: sourceFile,
                destination: destinationFile
            }
            promises.push(copyInfo)
        }
    }
    return Promise.all(promises.map(copyInfo => fsProm.copyFile(copyInfo.source, copyInfo.destination)))
}

const htmlBuilder = async () => {
    const indexPath = path.join(destinationPath, 'index.html')
    await fsProm.rm(indexPath, {force: true})
    const sourceComponents = path.join(__dirname, 'components')
    const componentFileNames = await fsProm.readdir(sourceComponents)
    const filesData = await Promise.all(componentFileNames.map((file) => fsProm.readFile(path.join(sourceComponents, file), 'utf-8')))
    const componentTemplate = componentFileNames.map((file) => path.basename(file, '.html')).map((file) => '{{' + file + '}}')
    let template = await fsProm.readFile(path.join(__dirname, 'template.html'), 'utf-8')
    componentTemplate.forEach((file, index) => {
        template = template.replace(file, filesData[index])
    })
    fs.createWriteStream(indexPath).write(template)
}

    createDir()
    .then(Promise.all([createCssFile(), copyDirectoryAssets(), htmlBuilder()]))