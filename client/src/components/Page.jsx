import React, {useContext} from 'react';
import { AiFillPlayCircle } from 'react-icons/ai';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';

import { LotteryContext } from '../context/LotteryContext';
import { Loader } from './';

const Input = ( { placeholder, name, type, value, handleChange } ) => (
    <input 
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 bg-transparent text-black border-none text-sm white-glassmorphism outline-double"
    />
);

const Page = () => {

    const { connectWallet, currentAccount, formData, setFormData, handleChange, enterLottery, changeVar } = useContext(LotteryContext);


    const handleSubmit = (e) => {
        const { amount } = formData;

		e.preventDefault();

		if( !amount  ) return;
		
		enterLottery();
        console.log("Lottery entered")

    }

    const handleSubmitVar = (e) => {
        const { amount } = formData;

		e.preventDefault();

		if( !amount  ) return;
		
		changeVar();
        console.log("Variable change initiated")

    }

    return (
        <div className="flex w-full justify-center items-center">

        <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded -full cursor=pointer hover:bg-[#2546bd]"
        >
            <p className="text-white text-base font-semibold">Connect Wallet</p>
        </button>

        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input placeholder="Amount" name="amount" type="text" handleChange={handleChange} />
            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {false ? (
                <Loader />
            ) : (
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-black w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounder-full cursor-pointer"
                >
                    Enter lottery
                </button>
            )}
        </div>

        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input placeholder="No. of players" name="amount" type="text" handleChange={handleChange} />
            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {false ? (
                <Loader />
            ) : (
                <button
                    type="button"
                    onClick={handleSubmitVar}
                    className="text-black w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounder-full cursor-pointer"
                >
                    Change variable
                </button>
            )}
        </div>

        </div>

        
        
    );
}

export default Page;