import { useState, useEffect } from 'react'
import AppRoot from './AppRoot'

import StoragePreloader from '@/storage/StoragePreloader'

export default function AppRootWrapper(props) {
  const {
    children,
    checkAppIsConfigured,
  } = props
  return (
    <>
      <StoragePreloader>
        <AppRoot checkAppIsConfigured={checkAppIsConfigured}>
          {children}
        </AppRoot>
      </StoragePreloader>
    </>
  )
}