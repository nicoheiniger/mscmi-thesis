import { map } from 'rxjs/operators';
import {
  Account,
  NetworkType,
  PublicAccount,
  RepositoryFactoryHttp,
  TransactionGroup,
  TransferTransaction,
  TransactionSearchCriteria
} from '@dhealth/sdk';
import { fetchIPFSDoc } from "./downloadData"
import fs from "fs";
import { decrypt } from './encryptFile';

const networkType = NetworkType.MAIN_NET;



export const receiveData = async (transactionHash:string, researchPrivKey:string, patientPubKey:string): Promise<void> => {


    const researchAccount = Account.createFromPrivateKey(
      researchPrivKey,
      networkType,
    )

    const patientPublicAccount = PublicAccount.createFromPublicKey(
      patientPubKey,
      networkType,
    )

    const nodeUrl = 'http://api-01.dhealth.cloud:3000';
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = repositoryFactory.createTransactionRepository();

    transactionHttp.getTransaction(transactionHash, TransactionGroup.Confirmed).pipe(map((x) => x as TransferTransaction)).subscribe(
        (transaction) => {
          const decryptedMessage = researchAccount.decryptMessage(
            transaction.message,
            patientPublicAccount,
          ).payload;
            const ipfsHash = decryptedMessage.substring(0,decryptedMessage.search("/ehr")+4);
            const decryptionKey = decryptedMessage.substring(decryptedMessage.search("/ehr")+4)

          fetchIPFSDoc(ipfsHash).then((text) => {

            const decryptedFile = decrypt(text, decryptionKey);

            fs.writeFile("../receivedUtils/decrypted_lab.hl7", decryptedFile, () => {     

            })

            console.log("\n File successfully downloaded!");
          }); 
          }
      )

}
