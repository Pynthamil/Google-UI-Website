"use client"

import { useEffect, useState } from "react"

export default function DesktopOnly({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent =
      typeof navigator === "undefined" ? "" : navigator.userAgent

    const mobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        userAgent
      )

    setIsMobile(mobile)
  }, [])

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-4">
            View this page on a laptop
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
