import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/posts";

export default function Post({ post }) {
  const router = useRouter();

  if (router.isFallback || !post) {
    return <div>Loading...</div>;
  }
  return (
    <Layout title={post.title}>
      <p className="m-4">
        {"ID : "}
        {post.id}
      </p>
      <p className="mb-4 text-xl font-bold">{post.title}</p>
      <p className="mb-12">{post.created_at}</p>
      <p className="px-10">{post.content}</p>
      <Link href="/blog-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span>Back to blog-page</span>
        </div>
      </Link>
    </Layout>
  );
}
// idの一覧を取得して、fallback
// fallbackは存在しないページを開いたときにどうするかの引数　falseだと４０４
// 動的にページを増やすAPPの場合はtrueにしとく 動的にページが増えた場合に対応する　増えてると途中はrouter.isFallbackがtrueになる
// ページに動的ルート（ドキュメント）があり、getStaticPropsを使用する場合は、
// ビルド時にHTMLにレンダリングする必要があるパスのリストを定義する必要があります。
// 動的ルートを使用するページからgetStaticPathsという非同期関数をエクスポートすると、
// Next.jsはgetStaticPathsで指定されたすべてのパスを静的に事前レンダリングします。
export async function getStaticPaths() {
  const paths = await getAllPostIds();

  return {
    paths,
    fallback: true,
  };
}
export async function getStaticProps({ params }) {
  // params はファイルの名の[id]をもっている、そこでparams.idで取得できる。
  // getStaticPropsでpropsと一緒にrevalidateパラメータも返すとISRが動く　数字は秒数
  // ISR とは Incremental Static Regeneration 
  // 設定されてない場合、DBが更新されてもページ上の値が変わらない、設定しているとページをビルドし直してくれる
  // 注　最初のページ表示ではステイルアンドリバリデーションで古いページを表示する、そしてもう一度リロードすると変更後のページが表示される
  // rebalidateの数字は　ページの再生成が何度も開始されないようにするインターバル
  //const { post: post } = await getPostData(params.id);
  const post = await getPostData(params.id);
  return {
    props: {
      post,
    },
    revalidate: 3,
  };
}
