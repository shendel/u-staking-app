import { ConnectWalletButton } from '@/web3/ConnectWalletButton'
import { DisconnectWalletButton } from '@/web3/DisconnectWalletButton'

import React, { useState } from "react";
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { fromWei } from '@/helpers/wei'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const {
    injectedAccount,
    injectedChainId,
    balance
  } = useInjectedWeb3()
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const disconnectWallet = () => {
    setIsMenuOpen(false); // Закрываем меню после отключения
  };
  return (
    <header
      className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
      style={{ transition: "box-shadow 0.3s ease" }}
    >
      {/* Десктопная версия меню */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип */}
        <div className="text-2xl font-bold text-blue-500">Liquo</div>

        {/* Мобильная версия (гамбургер-меню) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 text-gray-700 transition-transform ${
                isMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Десктопная версия меню */}
        <nav className="hidden md:flex items-center gap-4">
          <a href="#home" className="text-gray-700 hover:text-blue-500">
            Home
          </a>
          <a href="#stake" className="text-gray-700 hover:text-blue-500">
            Stake
          </a>
          <a href="#unstake" className="text-gray-700 hover:text-blue-500">
            Unstake
          </a>
          <a href="#claim" className="text-gray-700 hover:text-blue-500">
            Claim
          </a>
          {/* Отображение кошелька */}
          <div className="relative">
            <ConnectWalletButton
              connectView={(isConnecting, openConnectModal) => {
                return (
                  <button
                    disabled={isConnecting}
                    onClick={openConnectModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-4 md:ml-0 mt-4 md:mt-0 hover:bg-blue-600"
                  >
                    Connect Wallet
                  </button>
                )
              }}
              connectedView={(walletAddress) => {
                return (
                  <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )
              }}
              wrongChainView={(openChainModal) => {
                return (
                  <button
                    onClick={openChainModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-4 md:ml-0 mt-4 md:mt-0 hover:bg-blue-600"
                  >
                    Switch chain
                  </button>
                )
              }}
            />
            {/* Выпадающее меню */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 py-2 w-96 bg-slate-50 border border-gray-200 rounded shadow-lg z-10"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="px-4 py-2 text-gray-700">
                  <p className="font-bold">Wallet Address:</p>
                  <p className="truncate text-sm text-gray-600">{injectedAccount}</p>
                </div>
                <div className="px-4 py-2 text-gray-700">
                  <p className="font-bold">Balance:</p>
                  <p className="text-sm text-green-500">{fromWei(balance)} ETH</p>
                </div>
                <DisconnectWalletButton 
                  view={(handleDisconnect) => {
                    return (
                      <button
                        onClick={() => {
                          handleDisconnect()
                          setIsMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Disconnect Wallet
                      </button>
                    )
                  }}
                />
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Выпадающее мобильное меню */}
      <div
        className={`fixed inset-y-0 left-0 bg-white w-full md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50 shadow-lg`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          {/* Верхняя часть меню */}
          <div>
            {/* Закрыть меню */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Ссылки меню */}
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#home"
                  className="block text-gray-700 hover:text-blue-500 font-bold"
                  onClick={toggleMenu}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#stake"
                  className="block text-gray-700 hover:text-blue-500 font-bold"
                  onClick={toggleMenu}
                >
                  Stake
                </a>
              </li>
              <li>
                <a
                  href="#unstake"
                  className="block text-gray-700 hover:text-blue-500 font-bold"
                  onClick={toggleMenu}
                >
                  Unstake
                </a>
              </li>
              <li>
                <a
                  href="#claim"
                  className="block text-gray-700 hover:text-blue-500 font-bold"
                  onClick={toggleMenu}
                >
                  Claim
                </a>
              </li>
            </ul>
          </div>

          {/* Нижняя часть меню */}
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={toggleMenu}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Логотип */}
        <div className="text-2xl font-bold text-blue-500">Logo</div>

        {/* Навигационное меню */}
        <nav className="flex items-center gap-4">
          {/*
          <ul className="flex gap-4 text-gray-700">
            <li>
              <a href="#" className="hover:text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a href="#stake" className="hover:text-blue-500">
                Stake
              </a>
            </li>
            <li>
              <a href="#unstake" className="hover:text-blue-500">
                Unstake
              </a>
            </li>
            <li>
              <a href="#claim" className="hover:text-blue-500">
                Claim
              </a>
            </li>
          </ul>
          */}
          {/* Отображение кошелька */}
          <div className="relative">
            <ConnectWalletButton
              connectView={(isConnecting, openConnectModal) => {
                return (
                  <button
                    disabled={isConnecting}
                    onClick={openConnectModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-4 md:ml-0 mt-4 md:mt-0 hover:bg-blue-600"
                  >
                    Connect Wallet
                  </button>
                )
              }}
              connectedView={(walletAddress) => {
                return (
                  <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )
              }}
              wrongChainView={(openChainModal) => {
                return (
                  <button
                    onClick={openChainModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-4 md:ml-0 mt-4 md:mt-0 hover:bg-blue-600"
                  >
                    Switch chain
                  </button>
                )
              }}
            />
            {/* Выпадающее меню */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 py-2 w-96 bg-slate-50 border border-gray-200 rounded shadow-lg z-10"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="px-4 py-2 text-gray-700">
                  <p className="font-bold">Wallet Address:</p>
                  <p className="truncate text-sm text-gray-600">{injectedAccount}</p>
                </div>
                <div className="px-4 py-2 text-gray-700">
                  <p className="font-bold">Balance:</p>
                  <p className="text-sm text-green-500">{fromWei(balance)} ETH</p>
                </div>
                <DisconnectWalletButton 
                  view={(handleDisconnect) => {
                    return (
                      <button
                        onClick={() => {
                          handleDisconnect()
                          setIsMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Disconnect Wallet
                      </button>
                    )
                  }}
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
/*
export default function Header(props) {
  return (
    <header className="mainHeader">
      <div>
        <ConnectWalletButton
          connectView={(isConnecting, openConnectModal) => {
            return (
              <button disabled={isConnecting} onClick={openConnectModal}>Do connect</button>
            )
          }}
          connectedView={(address) => {
            return (<div>[{address}]</div>)
          }}
          wrongChainView={(openChainModal) => {
            return (
              <button onClick={openChainModal}>
                Switch chain
              </button>
            )
          }}
        />
      </div>
    </header>
  )
}
*/