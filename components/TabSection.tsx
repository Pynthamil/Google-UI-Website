"use client"

import { useRouter, usePathname } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import {
  Heart,
  Plus,
  X,
  Chromium,
  ListMusic,
  CircleAlert,
  EllipsisVertical,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Star,
  User,
} from "lucide-react"

import { GooglecolabIcon } from "./icons/simple-icons-googlecolab"

export default function TabSection() {
  const router = useRouter()
  const pathname = usePathname()

  // ✅ Proper active tab logic
  const activeTab =
    pathname === "/colab-notebook"
      ? "colab"
      : pathname === "/blog/introduction"
      ? "youtube"
      : "new-tab"

  return (
    <div>
      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        className="w-full bg-[#F7DAEF]"
      >
        <TabsList className="pb-0 bg-[#F7DAEF] border-b border-[#EEDEE7]">
          <Heart
            width="23px"
            height="23px"
            className="m-2 p-1 text-pink-400 hover:text-[#ff39c7] rounded-sm bg-[#FFBEED] hover:bg-[#ff89de]"
          />

          <TabsTrigger
            value="new-tab"
            onClick={() => router.push("/")}
            className="ml-3 hover:bg-[#F6B0EA] hover:rounded-md hover:h-8 data-[state=active]:bg-[#FFF7F9] w-40 border-0 border-r-3 h-5 data-[state=active]:h-8 border-pink-300 mr-2 rounded-none data-[state=active]:rounded-t-lg data-[state=active]:-mb-0.5 data-[state=active]:border-none drop-shadow-none data-[state=active]:drop-shadow-none flex items-center justify-between"
          >
            <Chromium /> New Tab <X />
          </TabsTrigger>

          <TabsTrigger
            value="colab"
            onClick={() => router.push("/colab-notebook")}
            className="hover:bg-[#F6B0EA] hover:rounded-md hover:h-8 data-[state=active]:bg-[#FFF7F9] w-40 border-0 border-r-3 h-5 data-[state=active]:h-8 border-pink-300 mr-2 rounded-none data-[state=active]:rounded-t-lg data-[state=active]:-mb-0.5 data-[state=active]:border-none drop-shadow-none data-[state=active]:drop-shadow-none flex items-center justify-between"
          >
            <GooglecolabIcon /> Colab <X />
          </TabsTrigger>

          <div className="hover:bg-[#F6B0EA] hover:rounded-full w-8 h-8 flex items-center justify-center">
            <Plus width="17px" height="17px" className="text-gray-700" />
          </div>
        </TabsList>
      </Tabs>

      {/* Address Bar Section */}
      <div className="bg-[#FFF7F9] pt-0 pl-2 flex items-center border-b border-[#EEDEE7]">
        <div className="hover:bg-[#F2EAEC] hover:rounded-full w-8 h-8 flex items-center justify-center">
          <ArrowLeft width="20px" height="18px" />
        </div>

        <div className="hover:bg-[#F2EAEC] hover:rounded-full w-8 h-8 flex items-center justify-center">
          <ArrowRight
            width="20px"
            height="18px"
            className="text-neutral-400"
          />
        </div>

        <div className="hover:bg-[#F2EAEC] hover:rounded-full w-8 h-8 flex items-center justify-center">
          <RotateCw width="20px" height="17px" />
        </div>

        {/* Localhost searchbar */}
        <InputGroup className="rounded-full m-3 flex-1 mx-4 bg-[#F0E6F0] hover:bg-[#E4DAE4] border-none focus:outline focus:outline-pink-900">
          <InputGroupInput placeholder="localhost:3000" />

          <InputGroupAddon className="bg-[#FFF7F9] hover:bg-[#DFCFDA] p-1 m-2 rounded-full">
            <CircleAlert
              width="20px"
              height="20px"
              className="text-gray-800"
            />
          </InputGroupAddon>

          <InputGroupAddon
            align="inline-end"
            className="hover:bg-[#DFCFDA] p-1 m-2 rounded-full"
          >
            <Star className="text-gray-800" />
          </InputGroupAddon>
        </InputGroup>

        <div className="border-r-5 mr-2 border-pink-200 text-[#FFF7F9]">
          p
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2 ml-auto pr-4">
          <div className="hover:bg-[#F2EAEC] hover:rounded-full w-8 h-8 flex items-center justify-center">
            <ListMusic width="20px" height="18px" />
          </div>

          <div className="hover:bg-[#F2EAEC] hover:rounded-full w-8 h-8 flex items-center justify-center">
            <User
              width="25px"
              height="23px"
              className="rounded-full bg-pink-300 text-pink-800 p-0.5"
            />
          </div>

          <div className="hover:bg-[#F2EAEC] hover:rounded-full w-8 h-8 flex items-center justify-center">
            <EllipsisVertical width="20px" height="18px" />
          </div>
        </div>
      </div>
    </div>
  )
}
