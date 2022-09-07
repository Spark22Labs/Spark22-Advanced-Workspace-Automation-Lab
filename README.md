# Programmatically Set Up a Vault Structure for Custody and Retail Operations - SPARK 2022 Lab [Advanced]


## Overview

The objective of this lab is to allow you to experience how to programmatically configure a sweep-to-omnibus vault structure, a structure that is core to most operations involving custody of assets (retail-facing, exchanges, neo banks and more).

The sweep-to-omnibus vault structure consists of a central, omnibus vault account in addition to vault accounts for each end-client. Funds are deposited into the individual vault accounts by end-client (Intermediate vault accounts) and then programmatically swept to the central Omnibus vault account, where the funds can be invested (treasury). One or more additional vault accounts are typically set up, for the purpose of containing funds allocated for end-client withdrawal requests. 

Our Help Center article on vault structures can be found [here](https://support.fireblocks.io/hc/en-us/articles/5253421857564).

## Exercise Outline:

**Coding Level: Intermediate to advanced** coding shortcuts available **to challenge advanced programmers** in steps 2, 4 & 5
  1. Create vault accounts and asset wallets.
  2. Fund the end-client vault accounts.
  3. Sweep end-client deposits into your Omnibus Deposits vault (treasury vault).
  4. Set up Gas Station.

**Prerequisites Validation & Testnet Workspace Access:**
  1. The Lab exercise will be performed on a designated shared testnet workspace for which you will receive access with an API user.
  2. Approach the Fireblocks Lab Partners and request an API user - that includes a API Key ID and a API Secret Key (Private key). 
  3. In addition, validate that you have satisfied all the prerequisites for your operating system.
  4. The function of the API Key ID is to identify the client responsible for a given API call. This API Key ID is not a Secret, and must be included in each request. The Secret Key is used for authentication, and should only be known to the client and to the API service.
  5. The API user is pre-configured for automated signing using the Fireblocks Communed Cosigner Machine for testing.
  6. The Secret must be saved on the computer from which the API calls will be made.

## Lab Workflow
### Step 1 - Initialize project:
**Project Directory:** Create a project directory by running the following set of commands in the terminal of your Integrated Development Environment (IDE) or in your text editor:
```
cd ~/<someplace>
mkdir spark22-Omnibus-lab
cd spark22-API-Omnibus-lab
```
**Note:** 'someplace' should be replaced with the file path

**Project File:** 
In the IDE:
  1. Create a new Javascript file and name it: **APILABSPARK22.js**;
  2. Copy the following SDK Initialization snippet into this file:

```
const FireblocksSDK = require("fireblocks-sdk").FireblocksSDK;
const fs = require('fs');
const path = require('path');
const apiKey = "Your API Key"
const apiSecret = fs.readFileSync(path.resolve(__dirname, "/fireblocks_secret.key"), "utf8");;
const fireblocks = new FireblocksSDK(apiSecret, apiKey);
```
**In the code block above, replace the values in each of the following variables:**
  1. In the variable 'apiKey', update your API key;
  2. In the variable 'apiSecret', update the full path to your Secret Key (ending with /fireblocks_secret.key)**

Save the file in the spark22-API-Omnibus-lab directory.

### Step 2A - Manual Setup of Vault Account structure and asset wallets:
As with real life scenarios, your end-clients will need their vault accounts and specific asset wallet addresses for their deposits. 
In this step you will create this structure of vault accounts and underlying wallet assets for ETH_TEST gas asset and TTTT Token used for our tests.
You will also need a Treasury vault account called Omnibus, as described in the overview section.
The following code utilizes SDK functions that will facilitate the above. 

- Add the following code block to your **APILABSPARK22.js** file.
``` 
async function createVaultAccount(name){
  let vault = await fireblocks.createVaultAccount(name);
    console.log(JSON.stringify(vault, null, 2));
}

async function createVaultAsset(vaultId, asset){
  let vaultAsset = await fireblocks.createVaultAsset(vaultId, asset);
    console.log(JSON.stringify(vaultAsset, null, 2));
}

```
**Manual Vault Account Structure creation**
  1. Execution of each of these functions is performed by specifying the function's name within your code.
  2. Each function includes required parameters for which it is defined to recieve as inputs. These parameters are specified within the parentheses ().
  3. The **createVaultAccount** function is defined with one parameter, **name** while the **createVaultAsset** function is defined with two parameters.
  4. For the purpose of this exercise, the **name** parameter of this vault account should be Spark22-[yourname]-1 (replace the 'yourname' string with your name).
  5. To have your code execute the **createVaultAccount** function by adding the following line of code to your **APILABSPARK22.js** file, and pasting the name defined in item 4 in the parentheses:
```
createVaultAccount("Spark22-[yourname]-1");
```
  6. Save the file. 
  7. Open terminal and navigate to the directory where the file is saved (cd ~/folder name).
  8. Run the following command:

```
node APILABSPARK22.js
```
  9. The **createVaultAccount** function returns a JSON structured like this:
```
{
  "id": "string",
  "name": "string",
  hiddenOnUI: false, // note this boolean tells if the vault remains visible or becomes hidden in the UI
  assets: [], // will show a list of assets once you create an Vault asset
  autoFuel: false // note this boolean will be used later
}

```
**Note:** "id": "string" is a key-value pair. The "string" value here is the vault account id that will be used as a parameter for the **createVaultAsset** function. Document the Id of each Vault account created, as it will be a required argument in other functions.


**Manual Asset Wallet Creation**
  1. The **createVaultAsset** function is defined with two parameters: **vaultId** and **vaultAsset**.
  2. Have your code execute the **createVaultAsset** function by updating your **APILABSPARK22.js** file in these steps: 
      - Comment out the execution of the prior functions you've called in the above steps by adding // (two forward slashes) in the beginning of the row.
      - Add the following lines of code while to invoke the function twice for that vault, creating "ETH_TEST" and "TTTT". Replace vaultId with the id string from the response received by the **createVaultAccount** function above.

```
createVaultAsset("Get the ID of the new vault account created above", "ETH_TEST");
createVaultAsset("Get the ID of the new vault account created above", "TTTT");

```
  3. Save the file. 
  4. In your terminal run:

```
node APILABSPARK22.js
```
  5. The createVaultAsset function returns a JSON structured like this:
```
{
  "id": "string",
  "address": "string",
  "legacyAddress": "string",
  "tag": "string"
}
```
  6. Repeat the 2 **Manual** processes invoking both the createVaultAccount and createVaultAsset as articulated above. You should create an overall of 3 end-client deposit vault accounts, as well as 1 Omnibus vault, all of which will contain an ETH_TEST and TTTT Token asset wallets:
  - Much like the already existing end-client deposit vault account, the two additional ones, should be similarly named “Spark22-[yourname]-2”, “Spark22-[yourname]-3”
  - The Omnibus vault account should be named “Spark22-[yourname]-omnibus
  - Consult your Fireblocks Lab Partners if needed

### Step 2B - Automation Challenge for Advanced Programmers: 
- Code the above 2 manual processes in step 2A using a single function with a loop that creates the entire vault structure and asset wallets.
- **Alternatively**, access the createOmnibusStructure code sample, ask your Fireblocks Lab Partners.

### Step 3 - Funding - Simulate end-client deposits to fund the new Vaults:
- Ask your Fireblocks Lab Partner to send and amount of 0.1 ETH_TEST and 2 TTTT to each of your end-client deposit vault accounts, while providing him the vault account ID relevant for each.
- ETH_TEST asset is the base asset of the Ropsten blockchain and it used for gas fees. TTTT tokens are ERC20 test tokens deployed by Fireblocks.

### Step 4A - Manual Sweeping to pool end-client deposits into your omnibus vault:
- Create 3 transactions in order to move the funds from the deposit accounts to the omnibus vault account. This is called a sweep operation. Add the following code block to your **APILABSPARK22.js** file. The effect will be a transfer of 2 TTTT tokens from each of your end client's vault accounts to your omnibus vault account.

```
async function createTransaction(yourname, assetId, depositVaultId, omnibusId){
    const payload = {
      assetId: assetId,
        source: {
          type: "VAULT_ACCOUNT",
          id: depositVaultId.toString() // **Id of Spark22-[yourname]-1**
        },
        destination: {
          type: "VAULT_ACCOUNT",
          id: omnibusId.toString() // **Id of Spark22-[yourname] Omnibus**
        },
      amount: "2",
      note: "Spark22-["+yourname+"]: My first Sweep transaction"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
  }
```
**Code Execution Workflow**
  1. Have your code execute the **createTransaction** function by performing the following steps:
  - Comment out the execution of the prior functions you've called in the above steps by adding // (two forward slashes) in the beginning of the row.
  - Add the following lines of code to invoke the createTransaction function. Replace depositVaultId & omnibusId with the id noted from the response received by the **createVaultAccount** function.
  - Replace yourname with your Full name e.g "First_Last"

```
createTransaction("yourname", "TTTT", depositVaultId, omnibusId); // replace [yourname], depositVaultId & omnibusId with your values
```
  2. Save the file. 
  3. In your terminal run:
```
node APILABSPARK22.js
```
  4. The createTransaction function returns a JSON structured like this:
```
{
  "id": "string",
  "status": "string"
}
```
  5. Repeat this step 3 times, each time replacing the depositVaultId account id, in order to manually complete the sweep.

### Step 4B - Automation Challenge for Advanced Programmers: 
  - Code a sweep function that filters the deposit accounts and moves the funds.
  - Filter vault accounts based on their vault name or vault asset amount threshold by filtering the results of the getVaultAccountsWithPageInfo() endpoint and also by executing createTransaction() in order to move the funds to your omnibus vault account.
  - **Alternatively**, access the sweep code sample, ask your Fireblocks Lab Partners.

### Step 5A - Gas Station - Control Gas flow using Fireblocks Gas Station service:
The Fireblocks Gas Station service automates gas replenishment for token transaction fees on EVM-based networks such as Ethereum, BSC, and others, eliminating manual monitoring and transferring of funds to these vault accounts to cover future transaction fees.
For the purpose of this exercise, a Gas Station wallet was created in advance and filled with enough gas to fuel your deposit accounts.

**Code Execution Workflow**
  1. Have your code execute the below functions to retrieve your Gas Station configuration, and also configure it, by following the below steps:

- Comment out the execution of the prior functions you've called in the above steps by adding // (two forward slashes) in the beginning of the row
- Add the following following function code blocks to your **APILABSPARK22.js** file. 
```
async function getGasStationInfo(){
  const gasStationInfo = await fireblocks.getGasStationInfo();
    console.log(JSON.stringify(gasStationInfo, null, 2));
}
async function setGasStationConf(gasThreshold, gasCap, assetId){
  const gasStation = await fireblocks.setGasStationConfiguration(gasThreshold, gasCap, assetId);
    console.log(JSON.stringify(gasStation, null, 2));
}
```
The getGasStationInfo function returns a JSON structured like this:
```
{
  "balance": {
    "ETH_TEST": "string"
  },
  "configuration": {
    "gasThreshold": "string",
    "gasCap": "string",
    "maxGasPrice": "string"
  }
}
```
  2. Add either of the below lines of code to your **APILABSPARK22.js** file based on the function you wish to invoke. 
  - Replace the gasThreshold ("0.005") & gasCap ("0.01") parameters with the values you wish to test. Asset Id, "ETH_TEST" remains a constant, whereas in Ethereum's mainnet blockchain you would be using "ETH" instead.
```
getGasStationInfo();
setGasStationConf("0.005", "0.01", "", "ETH_TEST");
```
  3. Save the file. 
  4. In your terminal run:
```
node APILABSPARK22.js
```
  5. Enable Gas Station autoFuel flag for the vault accounts you wish to sweep, by adding the following setAutoFuel() function code block to your **APILABSPARK22.js** file:
```
async function setAutoFuel(vaultAccountId, status){
  const setAutofuel = await fireblocks.setAutoFuel(vaultAccountId,status);
}
```
  - **Note:** Set status to 'true' in order to enable, and to 'false' in order to disable.

  6. Have your code execute the **setAutoFuel** function by performing the following steps: 
  - Comment out the execution of the prior functions you've called in the above steps by adding // (two forward slashes) in the beginning of the row
  - Add the below line of code to your file where you place in the vaultAccountId parameter, the ID of one of the end-client deposit vault account IDs as the argument and for the status boolean parameter, replace with either true or false argument based on the value you wish to test. By default the status of AutoFuel is set to false.
```
setAutoFuel("Spark22-[yourname]-1 Id", [true or false]);
```
  7. Save the file. 
  8. In your terminal run:
```
node APILABSPARK22.js
```
### Step 5B - Automation Challenge for Advanced Programmers:
 - Save lines of code and update the createVault loop coded in the first challenge in this exercise, to include the autoFuel parameter enabling it upon the creation of the vault account. Reference see [here](https://docs.fireblocks.com/api/?javascript#create-a-new-vault-account).

### Step 6 - Gas Station: Testing the refuel action

In order to simulate the Auto Fuel operation, we need to empty the ETH_TEST balance in a given vault account, effectively making the vault balance to be insufficient beneath the configured minimum threshold. The completion of the transfer, along with the below minimum vault balance that is the result of this transfer, should trigger the refuel transaction.
 
 **Important notes:** 
  Auto Fuel operation will trigger as long as the following conditions are met:
  - ETH_TEST, the base asset used for transaction fees, is below gasThreshold setting.
  - Spark22-[yourname]-1 has autoFuel enabled (set to true) and the balance of the ERC20 tokens using ETH_TEST is not 0.
  - The Gas Station Service was enabled for your workspace
  - The Gas Station wallet (your workspace Gas Tank), has enough gas to do the transfers to your deposit accounts - fueling. For the purpose of this lab, the Gas Station wallet was configured and provided with ETH_TEST to cover the fueling required for this Lab exercise.  

**Code Execution Workflow**
To Transfer all ETH_TEST asset balance from “Spark22-[yourname]-1” to omnibus vault account using createTransaction():
  1. Add the following function code block to your **APILABSPARK22.js** file.

```
async function createTransaction(yourname, assetId, depositVaultId, omnibusId){
    const payload = {
      assetId: "ETH_TEST",
        source: {
          type: "VAULT_ACCOUNT",
          id: depositVaultId.toString() // Id of Spark22-[yourname]-1 vault account
        },
        destination: {
          type: "VAULT_ACCOUNT",
          id: omnibusId.toString() // Id of Spark22-[yourname] Omnibus vault account
        },
      amount: "0.010525", // string of your total amount of available ETH_TEST in your source vault account
      note: "Spark22-["+yourname+"]: Empty ETH_TEST transaction"
    };
    const result = await fireblocks.createTransaction(payload);
    console.log(JSON.stringify(result, null, 2));
  }

```
  2. Have your code execute the **createTransaction** function by performing the following steps:
  - Comment out the execution of the prior functions you've called in the above steps by adding // (two forward slashes) in the beginning of the row.
  - Add the following line of code to invoke the createTransaction function. 
  - Replace depositVaultId & omnibusId with the id noted from the response received by the **createVaultAccount** function.
  - Replace yourname with your Full name e.g "First_Last".
```
createTransaction("yourname", "ETH_TEST", depositVaultId, omnibusId); // replace yourname, depositVaultId & omnibusId with your values
```
  3. Save the file.
  4. In your terminal run:
```
node APILABSPARK22.js
```
  5. The createTransaction function returns a JSON structured like this:
```
{
  "id": "string",
  "status": "string"
}
```  
  6. Watch the Gas Station service trigger an automatic fuel of your “Spark22-[yourname]-1” with “ETH_TEST” amount matching the Gas Cap setting of your Gas Station

# Success!
