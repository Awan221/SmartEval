"use client"

import { createContext, useContext, useRef, useEffect } from "react"

// Create a context to track mounted state
const MountContext = createContext({
  isMounted: null,
})

// Hook to safely perform operations only if component is still mounted
export function useSafeOperation() {
  const { isMounted } = useContext(MountContext)

  const safeOperation = (callback) => {
    if (isMounted && isMounted.current) {
      return callback()
    }
    return null
  }

  return safeOperation
}

// Provider component to wrap around components that need safe unmounting
export function SafeUnmountProvider({ children }) {
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return <MountContext.Provider value={{ isMounted }}>{children}</MountContext.Provider>
}

