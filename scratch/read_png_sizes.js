const fs = require('fs');
const path = require('path');

const dir = 'D:/My projects/aihomedecorator-native/assets/images/tutorials';
const files = ['1.png', '2.png', '3.png', '4.png'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  const buffer = fs.readFileSync(filePath);
  const width = buffer.readInt32BE(16);
  const height = buffer.readInt32BE(20);
  console.log(`${file}: ${width}x${height}`);
});
