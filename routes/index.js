var express = require('express');
var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const assert = require('assert');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://193.140.88.23:8545");
const web3 = new Web3(provider);

web3.eth.net.isListening()
    .then(() => console.log('web3 is connected'))
    .catch(e => console.log('Wow. Something went wrong'));
const abi= [
  {
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "fallback"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "authorized_company_list",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "set_second_owner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "authorize_company",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAuthorized_company",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "searchAuthCompList",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "bytes1",
        "name": "_byte",
        "type": "bytes1"
      },
      {
        "internalType": "bytes32",
        "name": "_value",
        "type": "bytes32"
      }
    ],
    "name": "kanit_ekle",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes1",
        "name": "_key",
        "type": "bytes1"
      }
    ],
    "name": "kanit_sorgula",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const contract_Address="0xaB0745679772C14859B20d7d0Fe2b5568Fdb60e0";//macellan.sol
const contract = new web3.eth.Contract(abi, contract_Address);
(async () => {
  const accounts = await web3.eth.getAccounts();
  //console.log(accounts);
  const balance = await web3.eth.getBalance(accounts[0]);
  console.log("balance", web3.utils.fromWei(balance, "ether"));
  //contract.methods.authorize_company(accounts[0]).send({ from: accounts[0], gas: '100000' });

  return accounts;
})();
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nevzat' });
});*/

router.get('/id1', (req, res) => {
  return new Promise((resolve, reject) => {
    contract.methods.getAuthorized_company().call(function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(res.send("Authorized Company Address(es):  "+Object.values(result)));
      }
    });
  });
});

router.get('/id2', (req, res) => {
  return new Promise((resolve, reject) => {
    contract.methods.kanit_sorgula(req.query.index).call(function (error, result) {
      if (error) {
        console.log(error);
      } else {
        if(result === "0x0000000000000000000000000000000000000000000000000000000000000000")
          resolve(res.send("Aradiginiz kanit yok"));
        else
          resolve(res.send("Aradiginiz kanit var ve bu kanit :  "+result));
      }
    });
  });
});

router.post('/', (req, res) => {
  return new Promise (function (resolve, reject) {
    let accounts =web3.eth.getAccounts( function (error, result) {
      if (error) {
        reject(error);
      } else {
        let accounts = result;
        console.log(accounts);
        contract.methods.kanit_ekle("0x19", req.query.kanit).send({ from: accounts[0], gas: '100000' },function (error, result) {
          if (error) {
            console.log(error);
          } else {
            resolve(res.send("kanit eklendi"));
          }
        });
      }
    })
  });
});


router.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

module.exports = router;
