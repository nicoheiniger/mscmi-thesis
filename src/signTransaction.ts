import { map, mergeMap } from 'rxjs/operators';
import {
  Account,
  AggregateTransaction,
  CosignatureSignedTransaction,
  CosignatureTransaction,
  NetworkType,
  RepositoryFactoryHttp,
  TransactionGroup,
} from '@dhealth/sdk';

/* start block 01 */
const cosignAggregateBondedTransaction = (
  transaction: AggregateTransaction,
  account: Account,
): CosignatureSignedTransaction => {
  const cosignatureTransaction = CosignatureTransaction.create(transaction);
  return account.signCosignatureTransaction(cosignatureTransaction);
};
/* end block 01 */

/* start block 02 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with private key
const privateKey =
  '8E6A752344D2FD95877AEE92121CF3636F69566E9067961E40BC6B0B26669429';
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with node endpoint
// replace with transaction hash to cosign
const transactionHash =
  '108DAC5410660208030FC7F8E43A6EC1290CB3B4815319D21841AD6953FF6163';
/* end block 02 */

/* start block 03 */
const nodeUrl = 'http://api-01.dhealth.cloud:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();

transactionHttp
  .getTransaction(transactionHash, TransactionGroup.Partial)
  .pipe(
    map((transaction) =>
    
      cosignAggregateBondedTransaction(
        transaction as AggregateTransaction,
        account,
      ),
    
    ),
    mergeMap((cosignatureSignedTransaction) =>
      transactionHttp.announceAggregateBondedCosignature(
        cosignatureSignedTransaction,
      ),
    ),
  )
  .subscribe(
    (announcedTransaction) => console.log(announcedTransaction),
    (err) => console.error(err),
  );
/* end block 03 */