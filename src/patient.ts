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

function selectRecipient() {
    console.log("\n Hi 👋! Welcome to the eHealth Data Sharing Platform!", '\n');
    console.log("Please enter who you want to share your data with: \n");
    console.log("--- [a] to share your data with academic research");
    console.log("--- [c] to share your data with commercial research \n");
    let recipient:string = prompt('Enter your data recipient: ');

    if (recipient === "a") 
    {
        console.log('\n You selected: academic research');
        const researchPublicKey = "4F1E7AFB05516A2AD652460816690BEC62E1DA5E4B82DF0580C18A5F7FFF8B48";
        return researchPublicKey;
    } 
    else if (recipient === "c")
    {
        console.log("\n You selected: commercial research"); 
        const researchPublicKey = "413AFB9351C5702137D22D3DDBC8660713A608EE01EF68D6C296D5FA254E515D";
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



async function uploadToIpfs(file){

        await Moralis.start({
        apiKey: "UHvLWtl7xtgrVLdG8e8mTfbcmCJta8pwFS0PYCmTfsgSz4KA5cnydV1goIb5nvub"
    });
    const uploadArray = [
        {
            path: "ehr",
            content: file
            
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

    uploadToIpfs(encryptedFile).then((hash) => {sendData(selectRecipient() as string, authenticate() as string, hash as string, encryptionKey).then();});
    })

