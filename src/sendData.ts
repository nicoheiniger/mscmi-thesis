import {
  Account,
  Deadline,
  PublicAccount,
  RepositoryFactoryHttp,
  TransferTransaction,
  UInt64,
} from '@dhealth/sdk';


export const sendData = async (researchPubKey: string, patientPrivateKey: string, IPFShash: string, encryptionKey): Promise<void> => {
  const nodeUrl = 'http://api-01.dhealth.cloud:3000';
  const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);

  const epochAdjustment = await repositoryFactory.getEpochAdjustment().toPromise();

  const networkType = await repositoryFactory.getNetworkType().toPromise();

  const patientAccount = Account.createFromPrivateKey(
    patientPrivateKey,
    networkType,
  );

  const researchPublicAccount = PublicAccount.createFromPublicKey(
    researchPubKey,
    networkType,
  );

  const encryptedMessage = patientAccount.encryptMessage(
    IPFShash + encryptionKey,
    researchPublicAccount,
  );

  const transferTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    researchPublicAccount.address,
    [],
    encryptedMessage,
    networkType,
    UInt64.fromUint(50000),
  );

  const networkGenerationHash = await repositoryFactory.getGenerationHash().toPromise();

  const signedTransaction = patientAccount.sign(
    transferTransaction,
    networkGenerationHash,
  );
  console.log("\n Your data was sent successfully with the transaction hash:", signedTransaction.hash);

  const transactionRepository = repositoryFactory.createTransactionRepository();

  const response = await transactionRepository
    .announce(signedTransaction)
    .toPromise();


};
