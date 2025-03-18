// import BlogCard from "@/layouts/components/BlogCard";
// import MDXContent from "@/helpers/MDXContent";
// import Pagination from "@/layouts/components/Pagination";
// import config from "@/config/config.json";
// import { getListPage, getSinglePage } from "@/lib/contentParser";
// import { getAllTaxonomy, getTaxonomy } from "@/lib/taxonomyParser";
// import { sortByDate } from "@/lib/utils/sortFunctions";
// import PageHeader from "@/partials/PageHeader";
// import PostSidebar from "@/partials/PostSidebar";
import SeoMeta from "@/partials/SeoMeta";
// import { Post } from "@/types";
// const { pagination } = config.settings;

import Main from "@/components/Main";
import Posts from "./Posts";
import loadMD from "@/utils/loadMD";

// for all regular pages
export default async function page() {
  const data = await loadMD("projects/_index");

  // const postIndex: Post = getListPage(`projects/_index.md`);
  // const { title, meta_title, description, image } = postIndex.frontmatter;
  // const posts: Post[] = getSinglePage("projects");
  // const allCategories = getAllTaxonomy("projects", "categories");
  // const categories = getTaxonomy("projects", "categories");
  // const tags = getTaxonomy("projects", "tags");
  // const sortedPosts = sortByDate(posts);
  // const totalPages = Math.ceil(posts.length / pagination);
  // const currentPosts = sortedPosts.slice(0, pagination);

  return (
    <>
      <SeoMeta {...data} />
      <Main {...data} />
      <Posts />

      {/*
      <section className="section">
        <div className="container">
          <div className="row gx-5">
            <div className="lg:col-8">
              <div className="row">
                {currentPosts.map((post: any, index: number) => (
                  <div key={index} className="mb-14 md:col-6">
                    <BlogCard data={post} />
                  </div>
                ))}
              </div>
              <Pagination
                section="projects"
                currentPage={1}
                totalPages={totalPages}
              />
            </div>

            <PostSidebar
              categories={categories}
              tags={tags}
              allCategories={allCategories}
            />
          </div>
        </div>
      </section>
      */}
    </>
  );
}
