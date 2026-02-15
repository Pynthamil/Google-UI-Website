"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import TabSection from "@/components/TabSection";

import Image from 'next/image';


import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';


export default function Page() {
  return (
    <div className="">

      

      {/* Google logo */}
      <div className="mt-15 flex flex-inline text-6xl font-semibold justify-center">
        <Image src="/Google logo.svg" alt="Google" width={300} height={300} />
      </div>


      <div className="flex flex-col items-center max-w-1000 mt-10">
        {/* Main searchbar */}
        <InputGroup className="rounded-full m-3 w-150 h-10 bg-white" >
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        {/* Cards to the links */}
        <Card className="bg-[#F0E6F0] m-3 h-57 w-150">
          <CardHeader className="px-4">
            <CardTitle className="text-neutral-600">Recently visited sites</CardTitle>
          </CardHeader>
          <CardContent className="px-5.5">
            <div className="bg-white p-1 mb-3 rounded-lg grid grid-cols-[1fr_auto] items-baseline-last">
              <p className="ml-2.5">Read my Blog</p>
              <Button variant="outline" size="sm" >
                Visit
              </Button>
            </div>

            <div className="bg-white p-1 mb-3 rounded-lg grid grid-cols-[1fr_auto] items-baseline-last">
              <p className="ml-2.5">
                Look at the Charts
              </p>
              <Button variant="outline" size="sm">
                Visit
              </Button>
            </div>

            <div className="bg-white p-1 mb-3 rounded-lg grid grid-cols-[1fr_auto] items-baseline-last">
              <p className="ml-2.5">My Inspo and Bloopers</p>
              <Button variant="outline" size="sm">
                Visit
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </ div>
      
    </div>
  );
}