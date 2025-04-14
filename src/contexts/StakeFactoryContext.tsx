import { createContext, useContext, useState, useEffect } from "react";
import fetchStakeFactory from '@/helpers_stake/fetchStakeFactory'


// Создаем контекст для нотификаций
const StakeFactoryContext = createContext({
  contractInfo: false,
  isFetchingFactory: false,
  isFactoryError: false,
  fetchFactoryInfo: () => {}
});

// Хук для доступа к контексту
export const useStakeFactory = () => {
  return useContext(StakeFactoryContext);
};


// Провайдер контекста
export default function StakeFactoryProvider(props) {
  const {
    chainId,
    contractAddress,
    children
  } = props
  
  const [ isFetchingFactory, setIsFetchingFactory ] = useState(true)
  const [ isFactoryError, setIsFactoryError ] = useState(false)
  const [ isNeedFetchFactory, setIsNeedFetchFactory ] = useState(true)
  const [ contractInfo, setContractInfo ] = useState(false)
 
  useEffect(() => {
    console.log('> StakeFactoryProvider', chainId, contractAddress, isNeedFetchFactory)
    if (chainId && contractAddress && isNeedFetchFactory) {
      console.log('>>> Fetching')
      setIsFetchingFactory(true)
      fetchStakeFactory({
        chainId,
        address: contractAddress,
      }).then((answer) => {
        console.log('>>> Factory info', answer)
        setIsFactoryError(false)
        setIsFetchingFactory(false)
        setIsNeedFetchFactory(false)
        setContractInfo(answer)
      }).catch((err) => {
        console.log('>>> failFetch', err)
        setIsFetchingFactory(false)
        setIsFactoryError(true)
        setIsNeedFetchFactory(false)
      })
    }
  }, [ chainId, contractAddress, isNeedFetchFactory ])
  
  const fetchFactoryInfo = () => {
    console.log('>>> need update stake factory')
    setIsNeedFetchFactory(true)
  }
  return (
    <StakeFactoryContext.Provider value={{
      contractInfo,
      isFactoryError,
      isFetchingFactory,
      fetchFactoryInfo,
    }}>
      {children}
    </StakeFactoryContext.Provider>
  );
}

