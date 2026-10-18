const { Web3 } = require("web3");
const ABI = require("../ABI.json");

const web3 = new Web3(process.env.WEB3_PROVIDER);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(ABI, contractAddress);

module.exports = { contract };
