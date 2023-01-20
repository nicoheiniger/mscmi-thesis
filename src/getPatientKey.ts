import fetch from 'node-fetch';

const nodeUrl = 'http://api-01.dhealth.cloud:3000';


export async function fetchPatientkey(hash:string) {
    const url = `${nodeUrl}/transactions/confirmed/${hash}`;
    const response = await fetch(url);
    return response.json();
  }
