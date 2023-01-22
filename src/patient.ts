import promptSync from 'prompt-sync';
const Moralis = require("moralis").default;
import fs from "fs";
import crypto from "crypto";
import { sendData } from './sendData';
import { encrypt } from './encryptFile'

declare const history: promptSync.History;

let prompt: promptSync.Prompt;

prompt = promptSync({});

var encryptionKey = crypto.randomBytes(20).toString('hex');
encryptionKey = crypto.createHash('sha256').update(String(encryptionKey)).digest('base64').substr(0, 32);

var logoCli = require('cli-logo'),
    version = " ",
    description = " ",
    logoConfig = {
        "name": "eHealth Platform",
        "description": description,
        "version": version
    };

function selectRecipient() {
    logoCli.print(logoConfig);
    console.log("\n Hi 👋! Welcome to the eHealth Data Sharing Platform!", '\n');
    console.log("Please enter who you want to share your data with: \n");
    console.log("--- [a] to share your data with academic research");
    console.log("--- [c] to share your data with commercial research \n");
    let recipient:string = prompt('Enter your data recipient: ');

    if (recipient === "a") 
    {
        console.log('\n You selected: academic research');
        const researchPublicKey = "5730A5D186E1315FD09B6CFB6A0D344CA547966D551E495F817C034B28B87FC4";
        return researchPublicKey;
    } 
    else if (recipient === "c")
    {
        console.log("\n You selected: commercial research"); 
        const researchPublicKey = "57668E2C5D3EB72F9A3AAE08F874AED3F242444065D155B0387EF753780835AB";
        return researchPublicKey;
    }
    else
    {
        console.log('Error: wrong input! Enter [a] or [c] as a recipient');
        selectRecipient();
    }
    
}

function authenticate() {
    let privateKey:string = prompt('Enter your private key: ');
    return privateKey;
    
}



async function uploadToIpfs(){

        await Moralis.start({
        apiKey: "UHvLWtl7xtgrVLdG8e8mTfbcmCJta8pwFS0PYCmTfsgSz4KA5cnydV1goIb5nvub"
    });
    const uploadArray = [
        {
            path: "ehr",
            content: fs.readFileSync('../sourceUtils/encrypted_file.hl7', {encoding: "base64"})
            
        },

    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: uploadArray,
    });
    const path = response.result[0].path;
    const urlParts = path.split("/");
    const hashPart = urlParts [urlParts .length - 2] + "/" + urlParts [urlParts .length - 1]
    return (hashPart);
}



    fs.readFile('../sourceUtils/lab.hl7', (err, file) => {
    if(err) return console.error(err.message);

    const encryptedFile = encrypt(file, Buffer.from(encryptionKey));
    fs.writeFile('../sourceUtils/encrypted_file.hl7', encryptedFile,  () => { 

    uploadToIpfs().then((hash) => {sendData(selectRecipient() as string, authenticate() as string, hash as string, encryptionKey).then();});

})
    })

