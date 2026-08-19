import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import BreakingBar from './BreakingBar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <BreakingBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
