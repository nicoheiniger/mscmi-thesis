import promptSync from 'prompt-sync';
import { receiveData } from './receiveData';
import { fetchPatientkey } from './getPatientKey';

const time1 = new Date().getTime();
console.log(time1);

declare const history: promptSync.History;

let prompt: promptSync.Prompt;

prompt = promptSync({});

function selectTransaction() {
    const time2 = new Date().getTime();
    console.log(time2);
    console.log("\n Hi 👋! Welcome to the eHealth Data Sharing Platform!", '\n');
    let transactionHash:string = prompt('Please enter the transaction hash to receive your files: ');
    return transactionHash;
}

function authenticate() {
    let researchPrivKey:string = prompt('\n Please enter your private key to receive your files: ');
    const time3 = new Date().getTime();
    console.log(time3);
    return researchPrivKey;
}

const transactionHash = selectTransaction();

fetchPatientkey(transactionHash).then((transaction) => {
    const patientPublicKey = transaction.transaction.signerPublicKey;
    receiveData(transactionHash,authenticate(),patientPublicKey).then()
});
