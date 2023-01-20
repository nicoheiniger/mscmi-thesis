import fetch from 'node-fetch';
import fs from "fs";



export async function fetchIPFSDoc(ipfsHash:string) {

  const url = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;

  const response = fetch(url).then(res => {

    new Promise((resolve, reject) => {

      const dest = fs.createWriteStream(`../receivedUtils/downloaded_encrypted_file.hl7`);

      res.body.pipe(dest);

      res.body.on('end', () => resolve(""));

      dest.on('error', reject);

    })

  });

  return response;

}

