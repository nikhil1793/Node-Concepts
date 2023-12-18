const fs = require("fs");
const path = require("path");

/**
 * * require gzip for example of transform stream
 * * will convert transform stream to writable stream using pipe
 */

const zlib = require("zlib");

const readableStream = fs.createReadStream(path.resolve(__dirname, "from.txt"), { encoding: 'utf8', highWaterMark: 32 });

const writabelStream = fs.createWriteStream(path.resolve(__dirname, "to.txt"));

/**
 * 
    readableStream.on("data", (chunk) => {
        console.log(chunk);
        writabelStream.write(chunk);
    });
 * 
 */


/***
 * * we can use pipe which is inbuilt for handling these things
 * ? pipes convert readable stream / transform stream to writable stream
 */

readableStream.pipe(writabelStream);

/**
 * * will convert readable stream ---> transform stream ---> writable stream using pipe
 */

const gzip = zlib.createGzip();

readableStream.pipe(gzip).pipe(fs.WriteStream(path.resolve(__dirname,"to.txt.gz")));







