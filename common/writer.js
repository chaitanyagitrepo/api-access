const path = require('path')
const fs = require('fs');
const fsAsync = require('fs').promises;
const common = require('./shared');

module.exports.writeFileSync = writeFileSyncRecursive;
function writeFileSyncRecursive(filename, content, charset) {
  const folders = filename.split(path.sep).slice(0, -1)
  if (folders.length) {
    // create folder path if it doesn't exist
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }
      return folderPath
    })
  }
  fs.writeFileSync(filename, content, charset)
}

module.exports.saveObjToFileAsync = saveObjToFileAsync;
async function saveObjToFileAsync(fileName, obj){
  let folderName = common.folderNameFromUrl(true); 
  const outputPath = path.join(common.options.outputPath, folderName, common.SITE || '');
  const exists = await pathExists(outputPath);
  if (!exists) {
      await fsAsync.mkdir(outputPath, { recursive: true });
  }
  console.log( `\n >>> Saving ${fileName} logs to:  \n >>> ${outputPath} \n`);
  fs.writeFileSync(path.join(outputPath, `${fileName}`), JSON.stringify(obj, null, 2));
  console.log('...DONE\n');
}

async function pathExists(pathToCheck) {
  try {
      await fsAsync.access(pathToCheck);
      return true;
  } catch (err) {
      if (!(err && err.code === 'ENOENT')) {
          throw err;
      }
      return false;
  }
}
