const fs = require('fs')
const jpeg = require('jpeg-js');
const rawInputData = jpeg.decode(fs.readFileSync('meme.jpg'));
let { data:imageData, width } = rawInputData;

const getHexFromRGB = colorValue => {
    let hexValue = colorValue.toString(16);
    if(hexValue.length < 2) hexValue = `0${hexValue}`;
    return hexValue;
}

const generateBoxShadow = ( row, col, hex ) => {
    return `${col}px ${row}px 1px 1px ${hex},\n`
}

let hexValues = []
for(let pixel = 0; pixel < imageData.length; pixel += 4) {
    let r = imageData[pixel];
    let g = imageData[pixel+1];
    let b = imageData[pixel+2]
    hex = `#${getHexFromRGB(r)}${getHexFromRGB(g)}${getHexFromRGB(b)}`;
    hexValues.push(hex)
}

let outputCSS = '';
for(let i = 0; i < hexValues.length; i++) {
    let col = i % width;
    let row = Math.floor(i / width);
    outputCSS += generateBoxShadow(row, col, hexValues[i]);
}
outputCSS = outputCSS.slice(0, -2);
const htmlTemplate = `
    <html>
        <head>
            <style>
                * {
                    margin: 0;
                    padding: 0;    
                }
                body {
                    background: black;
                }
                #output {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 0px;
                    height: 0px;
                    box-shadow: ${outputCSS}
                }
            </style>
        </head>
        <body>
            <div id="output" />
        </body>
    </html>
`;

fs.writeFileSync('output.html', htmlTemplate)
