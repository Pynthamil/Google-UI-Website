export interface PostMeta {
    slug: string
    title: string
    description: string
    by: string
}

export interface Post extends PostMeta {
    content: string
}