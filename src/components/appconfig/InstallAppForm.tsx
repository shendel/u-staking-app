import React from "react";
import { useStorageProvider } from '@/storage/StorageProvider'
import { ConnectWalletButton } from '@/web3/ConnectWalletButton'


const InstallAppForm = (props) => {
  const {
    children
  } = props
  const {
    isInstalled,
    isStorageSave,
    installAtDomain,
    storageIsLoading
  } = useStorageProvider()
  const buttonClass = `w-full py-4 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300`
  const buttonClassDisabled = `w-full py-4 bg-gray-500 text-white font-bold text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300`
 
  if (isInstalled) {
    return children
  }

  const handleInstallApp = () => {
    if (!isStorageSave) installAtDomain()
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">
          {`Ultimate Staking Web3 App`}
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          {`To continue working you must link this domain to your wallet.`}
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
                onClick={handleInstallApp}
                className={isStorageSave ? buttonClassDisabled : buttonClass}
              >
                {(isStorageSave) ? `Installing App at domain...` : `Install App at domain`}
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

export default InstallAppForm;