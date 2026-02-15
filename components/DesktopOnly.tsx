"use client"

import { useEffect, useState } from "react"

export default function DesktopOnly({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkScreen()
    window.addEventListener("resize", checkScreen)

    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-4">
            View this page on a laptop 💻
          </h1>
          <p className="text-gray-500">
            This experience is designed for larger screens.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
