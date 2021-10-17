import web3 from './web3.utils';
import {
    ABI, 
    ADDRESS
} from '../constants/contract.js';

const getContract = (abi, address) => new web3.eth.Contract(abi, address);

export const getNftContract = () => getContract(ABI, ADDRESS);