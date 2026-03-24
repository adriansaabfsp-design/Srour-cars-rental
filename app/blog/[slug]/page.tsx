"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("slug", "==", slug),
          where("published", "==", true)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const d = snapshot.docs[0];
          setPost({ id: d.id, ...d.data() } as BlogPost);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/4 rounded bg-gray-100" />
            <div className="h-64 rounded bg-gray-200" />
            <div className="space-y-3">
              <div className="h-4 rounded bg-gray-100" />
              <div className="h-4 rounded bg-gray-100" />
              <div className="h-4 w-4/5 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Post Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">This blog post doesn&rsquo;t exist or has been removed.</p>
          <Link href="/blog" className="mt-6 inline-block bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {post.updatedAt !== post.createdAt && " · Updated"}
          </p>
        </header>

        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg border border-luxury-border">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="prose-navy">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 text-[15px] leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 border-t border-luxury-border pt-6">
          <Link
            href="/blog"
            className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#1B3A5C] transition-colors hover:text-[#2A5080]"
          >
            &larr; Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
