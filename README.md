# Decentralized eHealth data sharing

MSc in Medical Informatics FHNW <br>
Master Thesis<br>
Nico Heiniger<br>

## Set-Up
1. install dependencies with:
```
npm i
````
2. Create folders to store documents to send
```
mkdir sourceUtils
````
3. Create folders to store received documents
```
mkdir receivedUtils
````
4. Place Documents to send in sourceUtils folder and adjust file name and public/private keys

5. Run patient side with:
```
ts-node patient.ts
````
6. Run research side with:
```
ts-node research.ts
````