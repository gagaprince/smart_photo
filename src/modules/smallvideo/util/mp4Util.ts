const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

export const getMd5 = (filePath:string):string => {
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5');
    hash.update(buffer, 'utf8');
    const md5 = hash.digest('hex');
    console.log(md5);
    return md5;
}

export const changeMd5 = (filePath:string):void => {
    const writer = fs.createWriteStream(filePath, {
        flags: "a+",
      });
      
      writer.write("gagaprince", err => {
        console.log("写入成功");
      });
}