import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/post-body";
import {
  fetchPostBySlug,
  formatPostPublishedAt,
  postPublishedAtIso,
  readingMinutesFromMarkdown,
} from "@/lib/posts";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

/** 每篇文章独立的 `<title>` / Open Graph / canonical（数据来自后端） */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await fetchPostBySlug(slug);
  if (!post || post.draft) {
    return { title: "未找到" };
  }
  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: postPublishedAtIso(post.date),
    },
    alternates: { canonical: url },
  };
}

/**
 * 文章详情：`GET /api/posts/:slug` 返回 Markdown，再由 `PostBody` 渲染。
 */
export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params;
  const post = await fetchPostBySlug(slug);
  if (!post || post.draft) notFound();

  const minutes =
    post.readingMinutes ?? readingMinutesFromMarkdown(post.content);
  const dateLabel = formatPostPublishedAt(post.date, "long");

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <header className="border-b border-stone-200/90 pb-10 dark:border-stone-800/90">
        <p className="text-sm text-stone-500 dark:text-stone-500">
          <time dateTime={postPublishedAtIso(post.date)}>{dateLabel}</time>
          <span className="mx-2" aria-hidden>
            ·
          </span>
          <span>{minutes} 分钟阅读</span>
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
          {post.description}
        </p>
        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <div className="pt-10">
        <PostBody content={post.content} />
      </div>
    </article>
  );
}
