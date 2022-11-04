const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises')

const showFileStats = (files) => {
    const filteredFiles = files.filter((file) => file.isFile())
    filteredFiles.forEach((file) => {
        const pathFile = path.join(folderPath, file.name)
        const extNameFile = path.extname(pathFile)
        const baseNameFile = path.basename(pathFile, extNameFile)
        
        const showResults = (file) => {
            console.log(baseNameFile + ' - ' + extNameFile.slice(1) + ' - ' + (file.size / 1024) + 'kb')
        }
        
        fsProm.stat(pathFile)
              .then((showResults))
    });
   
    

}


const folderPath = path.join(__dirname, '/secret-folder');
console.log(folderPath)

fsProm.readdir(folderPath, {withFileTypes: true})
      .then(showFileStats)




