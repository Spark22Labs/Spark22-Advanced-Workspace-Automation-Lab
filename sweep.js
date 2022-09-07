async function sweep(yourname, vaultAccountNamePrefixtoSweep, assetId, sweepAboveAmount, omnibusId){
    vaultListToSweep = await fireblocks.getVaultAccountsWithPageInfo({namePrefix: vaultAccountNamePrefixtoSweep, assetId: assetId, minAmountThreshold:sweepAboveAmount});
    for (let counter = 0; counter < Object.keys(vaultListToSweep.accounts).length; counter++) {
        const payload = {    
            "assetId" : assetId,
            "source" : {
                "type" : "VAULT_ACCOUNT",
                "id" : (vaultListToSweep.accounts[counter].id).toString()
            },
            "destination" : {
                "type" : "VAULT_ACCOUNT",
                "id" : omnibusId.toString()
            },
            "amount" : vaultListToSweep.accounts[counter].assets[0].total,
            "note" : "Spark22-["+yourname+"]: Sweeping from "+vaultListToSweep.accounts[counter].name
        }
        const sweep = await fireblocks.createTransaction(payload);
        console.log("Sweeping from "+vaultListToSweep.accounts[counter].name+" "+JSON.stringify(sweep, null, 2));
    }
}
sweep("yourname","vaultAccountNamePrefixtoSweep","TTTT",0,"omnibusId");
