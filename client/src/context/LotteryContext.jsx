import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress2, tokenAddress_test } from '../utils/constants';

import { tokenABI } from '../utils/constants2';

export const LotteryContext = React.createContext();

const { ethereum } = window;

// Connect to blockchain

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const lotteryContract = new ethers.Contract(contractAddress2, contractABI, signer);

    console.log({
        provider,
        signer,
        lotteryContract
    });

    return lotteryContract;
}

const getTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress_test, tokenABI, signer);

    console.log({
        provider,
        signer,
        tokenContract
    });

    return tokenContract;
}


// Wrapping entire react application with all data that gets passed into it
export const LotteryProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState('');
    //const [defaultAccount, setDefaultAccount] = useState(null);
    const [formData, setFormData] = useState({ amount: '' });
    const [isLoading, setIsLoading] = useState(false);
    //const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount')); // store it on local storage since it resets everytime u refresh

    // accepts events/keypresses,  prevstate -> new object // find out how it works
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
    
    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
        
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log(accounts);

            if (accounts.length){

                setCurrentAccount(accounts[0]);
                //accountChangedHandler(accounts[0]);
                // getAllTransactions();
            } else {
                console.log(error)
                throw new Error("No ethereum object.")
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
        
    };

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        //await getUserBalance(newAccount);
    };

    

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");
            // See all accounts and can choose to connect to 1
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0]);

            setCurrentAccount(accounts[0]);
            //accountChangedHandler(accounts[0]);
            //setCurrentAccount(accounts[0]);
            //await activate(injected)
            //window.location.reload();
            
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")

        }
    };

    const enterLottery = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");
            const { amount } = formData;
            const lotteryContract = getEthereumContract();
            const tokenContract = getTokenContract();
            //const parsedAmount = amount * 10**4; // to 1

            // const formattedAmount = ethers.utils.formatEther(amount); //into wei
            // const parsedAmount = ethers.utils.parseEther(formattedAmount); // into bignumber?
            
            //const transaction = await lotteryContract.deposit({ value: parsedAmount });
            //await transaction.wait()
            // await ethereum.request({ 
            //     method: 'eth_sendTransaction', 
            //     params: [{
            //         from: currentAccount,
            //         to: contractAddress,
            //         gas: '0x5208', // hexadecimal - 21000 GWEI
            //         value: parsedAmount._hex, // 0.00001
            //     }]
            // });
            
            const approval = await tokenContract.approve(contractAddress2, amount);
            await approval.wait();
            console.log(`Approval : ${approval}`)
            const lotteryHash = await lotteryContract.joinLottery(tokenAddress_test, amount);
            
            setIsLoading(true);
            console.log(`Loading - ${lotteryHash.hash}`);
            await lotteryHash.wait();
            setIsLoading(false);
            console.log(`Success - ${lotteryHash.hash}`);

            const getPrizeAmount = await lotteryContract.prizeAmount();
            //await getPrizeAmount.wait();
            console.log(`Prize amount: ${getPrizeAmount}`);

            //const transactionCount = await lotteryContract.getTransactionCount();
            //setTransactionCount(transactionCount.toNumber());

        } catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <LotteryContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, enterLottery }}>
            {children}
        </LotteryContext.Provider>
    );
}

