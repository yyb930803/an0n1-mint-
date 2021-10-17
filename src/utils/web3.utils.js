import Web3 from 'web3';
import {
    RPC_URL,
    ChainID
} from '../constants/provider';

// window.ethereum.enable();

// const provider = new Web3.providers.HttpProvider(RPC_URL)
const web3 = new Web3(window.web3.currentProvider); // new Web3(provider); // 

export default web3;