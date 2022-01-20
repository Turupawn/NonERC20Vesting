const NETWORK_ID = 4
const CONTRACT_ADDRESS = "0xb9ff299080696333a70ddF07bB9b97C770D3A710"
const BUSD_CONTRACT_ADDRESS = "0xaB999f02d0b43fD2A3bC10B813Cf7CDcE911DB72"
const JSON_CONTRACT_ABI_PATH = "./ContractABI.json"
const BUSD_JSON_CONTRACT_ABI_PATH = "./ERC20ABI.json"
var contract
var busd_contract
var accounts
var web3
var ENTRY_PRICE

function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se cambió el account, refrescando...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se el network, refrescando...";
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        window.location.reload()
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Porfavor conéctate a Metamask";
      }
    }else
    {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

const getContract = async (web3, address, abi_path) => {
  const response = await fetch(abi_path);
  const data = await response.json();
  
  const netId = await web3.eth.net.getId();
  var result = new web3.eth.Contract(
    data,
    address
    );
  return result
}

async function loadDapp() {
  metamaskReloadCallback()
  document.getElementById("web3_message").textContent="Please connect to Metamask"
  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        var awaitContract = async function () {
          contract = await getContract(web3, CONTRACT_ADDRESS, JSON_CONTRACT_ABI_PATH);
          busd_contract = await getContract(web3, BUSD_CONTRACT_ADDRESS, BUSD_JSON_CONTRACT_ABI_PATH);
          await window.ethereum.request({ method: "eth_requestAccounts" })
          accounts = await web3.eth.getAccounts()
          document.getElementById("web3_message").textContent="You are connected to Metamask"
          onContractInitCallback()
        };
        awaitContract();
      } else {
        document.getElementById("web3_message").textContent="Please connect to Rinkeby";
      }
    });
  };
  awaitWeb3();
}

const onContractInitCallback = async () => {
  //user_coins = await contract.methods.coins(accounts[0]).call()
  //document.getElementById("coins").innerHTML = "You have " + user_coins + " coins"
  ENTRY_PRICE = await contract.methods.ENTRY_PRICE().call()
  COIN_REWARD = await contract.methods.COIN_REWARD().call()
  user_is_whitelisted = await contract.methods.whitelist(accounts[0]).call()
  user_is_beneficiary = await contract.methods.is_beneficiary(accounts[0]).call()

  console.log(user_is_whitelisted)
  console.log(user_is_beneficiary)

  general_information_str = "Entry price: " + web3.utils.fromWei(ENTRY_PRICE) + " BUSD"
    + "<br>Coin reward: " + web3.utils.fromWei(COIN_REWARD) + " Tokens"
  
  if(user_is_whitelisted)
    general_information_str += "<br>You are whitelisted"
  else
  general_information_str += "<br>You are not whitelisted"

  if(user_is_beneficiary)
    general_information_str += "<br>You are beneficiary"
  else
    general_information_str += "<br>You are not beneficiary"
  
  document.getElementById("general_information").innerHTML = general_information_str
}


//// PUBLIC FUNCTIONS ////
/*
await buy()
*/
const buy = async (unlock_number) => {
  const result = await contract.methods.buy()
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Buying...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const approve = async () => {
  const result = await busd_contract.methods.approve(accounts[0], ENTRY_PRICE)
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Buying...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

//// OWNER FUNCTIONS ////

/*
await buy()
*/
const setCoinReward = async (coin_reward) => {
  const result = await contract.methods.setCoinReward(coin_reward)
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Buying...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const setEntryPrice = async (entry_price) => {
  const result = await contract.methods.setEntryPrice(entry_price)
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Buying...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const editWhitelist = async (addresses, value) => {
  const result = await contract.methods.setEntryPrice(addresses, value)
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Buying...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const withdrawBUSD = async () => {
  const result = await contract.methods.withdrawBUSD()
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Buying...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

loadDapp()