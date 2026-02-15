import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import { Heart } from 'lucide-react';
import { Plus } from 'lucide-react';
import { X } from 'lucide-react';
import { Chromium } from 'lucide-react';
import { Youtube } from 'lucide-react';
import { ListMusic } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { RotateCw } from 'lucide-react';
import { Star } from 'lucide-react';
import { User } from 'lucide-react';

export default function TabSection() {
    return (
        <div>
            {/* Tabs Section */}
            <Tabs defaultValue="new-tab" className="w-full bg-[#F7DAEF]">
                <TabsList className="pb-0 bg-[#F7DAEF] border-b border-[#EEDEE7]">
                <Heart width="23px" height="23px" className="m-2 p-1 text-pink-400 bg-[#FFBEED] rounded-sm"  />
                <TabsTrigger value="new-tab" className="ml-3 data-[state=active]:bg-[#FFF7F9] w-40 border-0 border-r-3 h-5 data-[state=active]:h-8 border-pink-300 mr-2 rounded-none data-[state=active]:rounded-t-lg data-[state=active]:-mb-0.5 data-[state=active]:border-none drop-shadow-none data-[state=active]:drop-shadow-none flex items-center justify-between"><Chromium /> New Tab <X /></TabsTrigger>
                <TabsTrigger value="youtube" className="data-[state=active]:bg-[#FFF7F9] w-40 border-0 border-r-3 h-5 data-[state=active]:h-8 border-pink-300 mr-2 rounded-none data-[state=active]:rounded-t-lg data-[state=active]:-mb-0.5 data-[state=active]:border-none drop-shadow-none data-[state=active]:drop-shadow-none flex items-center justify-between"><Youtube /> Youtube <X /></TabsTrigger>
                <Plus width="17px" height="17px" className="m-2 text-gray-700"/>
                </TabsList>
            </Tabs>

            <div className="bg-[#FFF7F9] pt-0 pl-2 flex items-center border-b border-[#EEDEE7]">
                <ArrowLeft width="20px" height="18px" className="m-2"/>
                <ArrowRight width="20px" height="18px" className="m-2 text-neutral-400"/>
                <RotateCw width="20px" height="17px" className="m-2"/>

                {/* Localhost searchbar */}
                <InputGroup className="rounded-full m-3 flex-1 mx-4 bg-[#F0E6F0] border-none focus:outline focus:outline-pink-900" >
                <InputGroupInput placeholder="localhost:3000" />
                <InputGroupAddon className="bg-[#FFF7F9] p-1 m-2 rounded-full">
                    <CircleAlert width="20px" height="20px" className="text-gray-800" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <Star className="text-gray-800" />
                </InputGroupAddon>
                </InputGroup>

                <div className="border-r-5 mr-2 border-pink-200 text-[#FFF7F9]"> p </div>
                
                {/* 3 icons section */}
                <div className="flex items-center gap-2 ml-auto pr-4">
                <ListMusic width="20px" height="18px" className="m-2" />
                <User width="25px" height="23px" className="m-2 rounded-full bg-pink-300 text-pink-800 p-0.5" />
                <EllipsisVertical width="20px" height="18px" className="m-2" />
                </div>
            </div>
        </div>
    )
}