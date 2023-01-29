import {
    Account,
    Deadline,
    PublicAccount,
    RepositoryFactoryHttp,
    TransferTransaction,
    UInt64,
    Mosaic,
    MosaicId,
    PlainMessage,
    AggregateTransaction,
    TransactionService,
    HashLockTransaction,
  } from '@dhealth/sdk';

  
  export const sendData = async (researchPubKey:string, patientPrivateKey:string, IPFShash:string, encryptionKey): Promise<void> => {
    const nodeUrl = 'http://api-01.dhealth.cloud:3000';
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
   
    const epochAdjustment = await repositoryFactory.getEpochAdjustment().toPromise();

    const networkType = await repositoryFactory.getNetworkType().toPromise();

    const dhpMosaicId = new MosaicId('39E0C49FA322A459');
    const dhpDivisibility = 6;

    const patientAccount = Account.createFromPrivateKey(
      patientPrivateKey,
      networkType,
    );

    const researchPublicAccount = PublicAccount.createFromPublicKey(
      researchPubKey,
      networkType,
    );
  
    const encryptedMessage = patientAccount.encryptMessage(
      IPFShash+encryptionKey,
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

    const returnTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    patientAccount.address,
    [
      new Mosaic(
        dhpMosaicId,
        UInt64.fromUint(1 * Math.pow(10, dhpDivisibility)),
      ),
    ],
    PlainMessage.create(""),
    networkType,
    UInt64.fromUint(50000),
  );

  const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(epochAdjustment),
    [
      transferTransaction.toAggregate(patientAccount.publicAccount),
      returnTransaction.toAggregate(researchPublicAccount),
    ],
    networkType,
    [],
    UInt64.fromUint(50000),
  );

    const networkGenerationHash = await repositoryFactory.getGenerationHash().toPromise();

    const signedTransaction = patientAccount.sign(
      aggregateTransaction,
      networkGenerationHash,
    );
    console.log("\n Your data was sent successfully with the transaction hash:",signedTransaction.hash);

    const hashLockTransaction = HashLockTransaction.create(
      Deadline.create(epochAdjustment),
      new Mosaic(
        dhpMosaicId,
        UInt64.fromUint(10 * Math.pow(10, dhpDivisibility)),
      ),
      UInt64.fromUint(480),
      signedTransaction,
      networkType,
      UInt64.fromUint(50000),
    );

    const signedHashLockTransaction = patientAccount.sign(
      hashLockTransaction,
      networkGenerationHash,
    );

    const transactionRepository = repositoryFactory.createTransactionRepository();
    const listener = repositoryFactory.createListener();
    const receiptHttp = repositoryFactory.createReceiptRepository();
    const transactionService = new TransactionService(transactionRepository, receiptHttp);
    
    listener.open().then(() => {
      transactionService
        .announceHashLockAggregateBonded(
          signedHashLockTransaction,
          signedTransaction,
          listener,
        )
        .subscribe(
          (x) => console.log(x),
          (err) => console.log(err),
          () => listener.close(),
        );
    });



    /* const response = await transactionRepository
      .announce(signedTransaction)
      .toPromise(); */
    

  };
  