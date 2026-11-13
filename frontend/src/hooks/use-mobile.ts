import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const mediaQuery = React.useMemo(
    () => `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    []
  )

  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const query = window.matchMedia(mediaQuery)
    query.addEventListener("change", onStoreChange)
    return () => query.removeEventListener("change", onStoreChange)
  }, [mediaQuery])

  const getSnapshot = React.useCallback(
    () => window.matchMedia(mediaQuery).matches,
    [mediaQuery]
  )

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}
