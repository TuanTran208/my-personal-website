const pdfLib = require('pdf-parse');
// We know from previous debug that PDFParse is the class
const PDFParse = pdfLib.PDFParse;

console.log('Testing new PDFParse()...');

try {
    const buffer = Buffer.from('dummy pdf content');
    // Try instantiation
    const instance = new PDFParse(buffer);
    console.log('Instantiation success!');
    console.log('Instance keys:', Object.keys(instance));

    // Check for data
    console.log('Instance.text:', instance.text);
    console.log('Instance.data:', instance.data);

} catch (e: any) {
    console.log('Instantiation failed:', e.message);
}
