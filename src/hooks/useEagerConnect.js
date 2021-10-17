import { useEffect } from 'react'
import useAuth from './useAuth'

const connectorLocalStorageKey = "connectorIdv2";

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey)

    if (connectorId) {
      login(connectorId)
    }
  }, [login])
}

export default useEagerConnect
