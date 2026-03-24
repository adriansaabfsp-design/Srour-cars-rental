"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("published", "==", true),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[]);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Breadcrumb items={[{ label: "Blog" }]} />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#1B3A5C]">
            Our Stories
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            BLOG
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tips, stories, and guides for driving in Lebanon
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border border-luxury-border bg-luxury-card">
                <div className="h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mt-3 h-3 w-full rounded bg-gray-100" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-luxury-border bg-luxury-card p-16 text-center">
            <p className="text-sm text-gray-900/30">No blog posts yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden border border-luxury-border bg-luxury-card transition-shadow hover:shadow-lg"
              >
                {post.coverImage ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-[#F0F4F8]">
                    <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#1B3A5C] transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-gray-500">
                    {post.content}
                  </p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
