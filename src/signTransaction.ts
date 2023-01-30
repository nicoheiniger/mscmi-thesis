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

export async function cosignTransaction(transactionHash: string, researchPrivKey: string) {
  
  const networkType = NetworkType.MAIN_NET;

  const cosignAggregateBondedTransaction = (
    transaction: AggregateTransaction,
    account: Account,
  ): CosignatureSignedTransaction => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    return account.signCosignatureTransaction(cosignatureTransaction);
  };

  const account = Account.createFromPrivateKey(researchPrivKey, networkType);

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

} 
