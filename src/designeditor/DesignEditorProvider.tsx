import { useState, useEffect, createContext, useContext } from 'react'

const DesignEditorProviderContext = createContext({
  mode: 'NORMAL',
  page: 'HOME',
  design: {},
  saveDesign: () => {},
  changeMode: () => {},
  setStyle: () => {},
  getStyle: () => {},
})


export const useDesignEditorProvider = () => {
  return useContext(DesignEditorProviderContext)
}

export const DesignEditorProvider = (props) => {
  const {
    children
  } = props
  
  const [ mode, setMode ] = useState(false)
  const [ page, setPage ] = useState(false)
  
  const saveDesign = () => {}
  const changeMode = (mode) => setMode(mode)
  const setStyle = (options) => {}
  const getStyle = (options) => {}
  
  <DesignEditorProviderContext.Provider
    value={{
      mode,
      page,
      saveDesign,
      changeMode,
      setStyle,
      getStyle
    }}
  >
    {children}
  </DesignEditorProviderContext.Provider>
}
// DesignEditorProvider.tsx