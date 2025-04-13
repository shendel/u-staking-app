import React, { useState } from "react";

import DepositPeriodsConfigurator from './DepositPeriodsConfigurator'
import AllocationChart from "./AllocationChart";
import ApyChart from "./ApyChart"
import CollapsibleGroup from "@/components/CollapsibleGroup";
import StakingSimulation from "./DepositPeriod/StakingSimulation"
import Tabs from "@/components/appconfig/Tabs";

const AdminPanelDeploy = () => {
  const [blockchain, setBlockchain] = useState("ethereum");
  const [stakingToken, setStakingToken] = useState("");
  const [rewardToken, setRewardToken] = useState("");

  const tabs = [
    { key: "tab1", title: "Tab 1", disabled: false },
    { key: "tab2", title: "Tab 2", disabled: true }, // Неактивная вкладка
    { key: "tab3", title: "Tab 3", disabled: false },
    { key: "tab4", title: "Tab 4", disabled: false },
  ];

  const [activeTab, setActiveTab] = useState("tab1")
  
  // Состояния для информации о токенах
  const [stakingTokenInfo, setStakingTokenInfo] = useState({});
  const [rewardTokenInfo, setRewardTokenInfo] = useState({});

  const [ lockPeriods, setLockPeriods ] = useState([])
  
  const handlePeriodsUpdate = (newPeriods) => {
    console.log('>>> UPDATED LOCK PERIODS', newPeriods)
    setLockPeriods(newPeriods)
  }
  const onPeriodEdit = (isEditableArray) => {
    console.log('>>> ON PERIODS EDIT', isEditableArray)
  }
  // Запрос информации о токене
  const requestTokenInfo = async (tokenAddress) => {
    if (!tokenAddress) return;

    // Моковые данные вместо реального запроса
    try {
      const mockData = {
        symbol: "MCK",
        decimals: 18,
        name: "Mock Token",
      };

      return mockData;
    } catch (error) {
      console.error("Failed to fetch token info:", error);
      return null;
    }
  };

  const handleRequestStakingTokenInfo = async () => {
    const info = await requestTokenInfo(stakingToken);
    if (info) {
      setStakingTokenInfo(info);
    }
  };

  const handleRequestRewardTokenInfo = async () => {
    const info = await requestTokenInfo(rewardToken);
    if (info) {
      setRewardTokenInfo(info);
    }
  };

  const handleDeployContract = () => {
    if (!stakingToken || !rewardToken) {
      alert("Please fill in both token addresses and request their info.");
      return;
    }

    // Здесь можно добавить логику деплоя контракта
    alert("Contract deployment initiated!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Deploy Staking Contract</h2>

      {/* Выбор целевого блокчейна */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
          Select Target Blockchain:
        </label>
        <select
          value={blockchain}
          onChange={(e) => setBlockchain(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="ethereum">Ethereum</option>
          <option value="binance">Binance Smart Chain</option>
          <option value="polygon">Polygon</option>
        </select>
      </div>

      {/* Параметры стейкинга */}
      <div>
        <h3 className="text-xl font-bold mb-4">Staking Parameters</h3>

        {/* Токен для стейкинга */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Staking Token Address:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={stakingToken}
              onChange={(e) => setStakingToken(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleRequestStakingTokenInfo}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Request Info
            </button>
          </div>

          {/* Информация о токене для стейкинга */}
          {Object.keys(stakingTokenInfo).length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>
                <strong>Symbol:</strong> {stakingTokenInfo.symbol}
              </p>
              <p>
                <strong>Name:</strong> {stakingTokenInfo.name}
              </p>
              <p>
                <strong>Decimals:</strong> {stakingTokenInfo.decimals}
              </p>
            </div>
          )}
        </div>

        {/* Токен награды */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Reward Token Address:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={rewardToken}
              onChange={(e) => setRewardToken(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleRequestRewardTokenInfo}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Request Info
            </button>
          </div>

          {/* Информация о токене награды */}
          {Object.keys(rewardTokenInfo).length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>
                <strong>Symbol:</strong> {rewardTokenInfo.symbol}
              </p>
              <p>
                <strong>Name:</strong> {rewardTokenInfo.name}
              </p>
              <p>
                <strong>Decimals:</strong> {rewardTokenInfo.decimals}
              </p>
            </div>
          )}
        </div>
        {/* Группа вкладок */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChanged={(tabKey) => {
            console.log("Active Tab Changed:", tabKey);
            setActiveTab(tabKey);
          }}
        >
          {/* Контент вкладок */}
          {activeTab === "tab1" && <p>Content for Tab 1</p>}
          {activeTab === "tab3" && <p>Content for Tab 3</p>}
          {activeTab === "tab4" && <p>Content for Tab 4</p>}
        </Tabs>
        <DepositPeriodsConfigurator
          isContractEdit={false}
          onPeriodsUpdated={handlePeriodsUpdate}
          lockPeriods={lockPeriods}
          onPeriodEdit={onPeriodEdit}
        />

        {/* Большая кнопка деплоя контракта */}
        <button
          onClick={handleDeployContract}
          className="w-full bg-green-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!stakingToken || !rewardToken}
        >
          Deploy Staking Contract
        </button>
      </div>
    </div>
  );
};

export default AdminPanelDeploy;