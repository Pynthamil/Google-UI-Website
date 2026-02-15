import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { Post, PostMeta } from "@/types/post"

const contentDirectory = path.join(process.cwd(), "content")

export function getPostSlugs() {
  return fs.readdirSync(contentDirectory).map((file) =>
    file.replace(".md", "")
  )
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(contentDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    description: data.description,
    by: "pynthamil",
    content,
  }
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs().map((slug) => {
    const post = getPostBySlug(slug)
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      by: "pynthamil",
    }
  })
}
