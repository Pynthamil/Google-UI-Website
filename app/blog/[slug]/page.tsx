import { getPostBySlug } from "@/lib/posts"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { Menu } from "lucide-react"

const components = [
  {
    title: "Introduction",
    href: "/blog/introduction",
    description: "Setting the stage for Google’s expansion and extinction cycles.",
  },
  {
    title: "Questions",
    href: "/blog/questions",
    description: "The questions explored in this analysis.",
  },
  {
    title: "Chapter 1",
    href: "/blog/chapter-1-rise-and-reign",
    description: "The Rise, The Reign, and The Spectacular Identity Meltdown",
  },
  {
    title: "Chapter 2",
    href: "/blog/chapter-2-mad-scientist-era",
    description: "Google Enters Its Mad Scientist Era",
  },
  {
    title: "Chapter 3",
    href: "/blog/chapter-3-the-reaping",
    description: "And Then Came the Reaping",
  },
  {
    title: "Chapter 4",
    href: "/blog/chapter-4-never-meant-to-last",
    description: "The Age of Things That Were Never Meant to Last",
  },
  {
    title: "Chapter 5",
    href: "/blog/chapter-5-lineage",
    description: "The Lineage That Forgot How to Grow Old",
  },
  {
    title: "Chapter 6",
    href: "/blog/chapter-6-kingdoms",
    description: "Some Kingdoms Fall Faster Than Others",
  },
  {
    title: "Chapter 7",
    href: "/blog/chapter-7-blame-the-internet",
    description: "Blame the Internet",
  },
  {
    title: "Conclusion & Insights",
    href: "/blog/conclusion-insights",
    description: "The final pattern behind Google’s graveyard.",
  },
]

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = getPostBySlug(slug)

  if (!post) return notFound()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-16 py-10 min-h-screen bg-white">

      {/* LEFT SIDE IMAGE */}
      <div className="flex justify-center items-start">
        <Image
          src="/google-banner.svg"
          alt="Google Banner"
          width={500}
          height={500}
          className="w-full max-w-lg"
        />
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="bg-[#f5f5f5] border border-neutral-300 rounded-lg p-8 h-fit">

        {/* HEADER ROW */}
        <div className="flex justify-between items-center mb-6 border border-neutral-400 rounded-md px-4 py-2 bg-white">

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="p-2">
                  <Menu size={18} />
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>

              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <h1 className="text-lg font-medium">
            {post.title}
          </h1>

        </div>

        {/* MARKDOWN CONTENT */}
        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

      </div>

    </div>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">
              {children}
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
