import promptSync from 'prompt-sync';
import { receiveData } from './receiveData';
import { fetchPatientkey } from './getPatientKey';
import { cosignTransaction } from './signTransaction';

declare const history: promptSync.History;

let prompt: promptSync.Prompt;

prompt = promptSync({});

var logoCli = require('cli-logo'),
    version = " ",
    description = " ",
    logoConfig = {
        "name": "eHealth Platform",
        "description": description,
        "version": version
    };

function selectTransaction() {
    logoCli.print(logoConfig);
    console.log("\n Hi 👋! Welcome to the eHealth Data Sharing Platform!", '\n');
    let transactionHash:string = prompt('Please enter the transaction hash to receive your files: ');
    return transactionHash;
}

function authenticate() {
    let researchPrivKey:string = prompt('\n Please enter your private key to receive your files: ');
    return researchPrivKey;
}

const transactionHash = selectTransaction();
const researchPrivateKey = authenticate();

//cosignTransaction(transactionHash,researchPrivateKey).then();


fetchPatientkey(transactionHash).then((transaction) => {
    const patientPublicKey = transaction.transaction.signerPublicKey;
    
    
    receiveData(transactionHash,researchPrivateKey,patientPublicKey).then();
});
