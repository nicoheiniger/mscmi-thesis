import fetch from 'node-fetch';
import fs from "fs";


export const downloadFile = (async (ipfsHash:string) => {
  const url = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
  const path = `../receivedUtils/downloaded_encrypted_file.hl7`;

  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});
