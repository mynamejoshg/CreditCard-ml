var fs = require("fs");
var csv = require("csv-parser")
var path = require("path");
var formidable = require("formidable");

function processUpload(filePath)
{
  var file = path.parse(filePath);
  var fileName = file.name+Date.now()+file.ext;
  console.log(fileName);
  fs.rename(filePath, file.dir+"/accepted/"+fileName, function (err)
  {
    if (err) throw err;
    console.log('File Renamed!');
  });
  if(file.ext == ".csv")
  {
    fs.createReadStream(file.dir+"/accepted/"+fileName)
    .pipe(csv())
    .on('data', (row) => {
      console.log(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
  }
  else
  {
    console.log("not a csv file!")
  }

};
exports.Upload = function(req)
{
  var result="";
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/' + file.name
        console.log("Upload Handler path: "+file.path);
        result = file.path.toString();
    })
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', (name, file) => {
      console.log('Uploaded file', name, file)
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
      result = "fail";
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
      result = "fail";
    })
    .on('end', (name, file) => {
      processUpload(result);
    })
    return result;
};
