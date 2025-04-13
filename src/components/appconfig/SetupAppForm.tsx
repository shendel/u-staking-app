import React from "react";
import { useStorageProvider } from '@/storage/StorageProvider'
import { ConnectWalletButton } from '@/web3/ConnectWalletButton'

const SetupAppForm = (props) => {
  const {
    children,
    gotoPage
  } = props

  const {
    isInstalled,
    isStorageSave,
    installAtDomain,
    storageIsLoading,
    isOwner
  } = useStorageProvider()

  const buttonClass = `w-full py-4 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300`
  const buttonClassDisabled = `w-full py-4 bg-gray-500 text-white font-bold text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300`

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">
          {`Ultimate Staking Web3 App`}
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          {`App not configured`}
        </p>
        <ConnectWalletButton
          connectView={(isConnecting, openConnectModal) => {
            return (
              <button
                disabled={isConnecting}
                onClick={openConnectModal}
                className={(isConnecting) ? buttonClassDisabled : buttonClass}
              >
                {(isConnecting) ? `Connecting wallet` : `Connect Wallet`}
              </button>
            )
          }}
          connectedView={(walletAddress) => {
            return (
              <button
                onClick={() => { gotoPage('/settings') }}
                className={isStorageSave ? buttonClassDisabled : buttonClass}
              >
                {`Go to setup`}
              </button>
            )
          }}
          wrongChainView={(openChainModal) => {
            return (
              <button
                onClick={openChainModal}
                className={buttonClass}
              >
                Switch chain
              </button>
            )
          }}
        />
      </div>
    </div>
  );
};

export default SetupAppForm;