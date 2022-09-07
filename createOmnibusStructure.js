const FireblocksSDK = require("fireblocks-sdk").FireblocksSDK;
const fs = require('fs');
const path = require('path');
const apiSecret = fs.readFileSync(path.resolve(__dirname, "fireblocks_secret.key"), "utf8");
const apiKey = "[apiKey]; 
const fireblocks = new FireblocksSDK(apiSecret, apiKey);

async function createVaultAccount(name){
    let vault = await fireblocks.createVaultAccount(name);
    console.log(JSON.stringify(vault, null, 2));
  }
  
  async function createVaultAsset(vaultId, asset){
    let vaultAsset = await fireblocks.createVaultAsset(vaultId, asset);
    console.log(JSON.stringify(vaultAsset, null, 2));
  }

//   createVaultAccount("Spark22-[yourname]-1");
//   createVaultAsset("the ID for the new vault account you noted above", "ETH_TEST");
//   createVaultAsset("the ID for the new vault account you noted above", "TTTT");

  async function createVaultAccounts(noOfVaultAccounts, assetId, vaultAccountNamePrefixtoSweep, omnibusVaultName){
    for (let counter = 0; counter<noOfVaultAccounts ; counter++){
        let vault = await fireblocks.createVaultAccount(vaultAccountNamePrefixtoSweep.toString()+counter.toString());
        vaultDict = {vaultName: vault.name, vaultID: vault.id}
        let vaultAsset = await fireblocks.createVaultAsset(vault.id, assetId);
        console.log(JSON.stringify(vaultAsset, null, 2));
    }
    omnibusVault = await fireblocks.createVaultAccount(omnibusVaultName);
    const omnibusVaultAsset = await fireblocks.createVaultAsset(omnibusVault.id, assetId);
    console.log(JSON.stringify(omnibusVaultAsset, null, 2));

}
createVaultAccounts(3, "ETH_TEST","Spark22-[yourname]-","Spark22-[yourname] Omnibus"); // yourname should be typed as one word or with underscores
