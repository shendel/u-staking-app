import StorageProvider from './StorageProvider'
import StoragePreloader from './StoragePreloader'


export default function StoragePreloaderWrapper(props) {
  const {
    children,
    checkIsConfigured
  } = props
  
  return (
    <>
      <StorageProvider isPreloading={true}>
        <StoragePreloader checkIsConfigured={checkIsConfigured}>
          {children}
        </StoragePreloader>
      </StorageProvider>
    </>
  )
}