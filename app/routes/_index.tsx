import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import Desktop from "~/components/Desktop";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Ppconde OS" },
    { name: "description", content: "Welcome to Ppconde OS" },
  ];
};

export const loader: LoaderFunction = async ({ context }) => {
  const { env } = context.cloudflare;
  const { results } = await env.DB.prepare("SELECT * FROM posts LIMIT 5").all();
  return json(results);
};

export default function Index() {
  const results = useLoaderData<typeof loader>();

  return (
    <>
      <div>
        <h1>Welcome to Remix</h1>
        <div>
          A value from D1:
          <pre>{JSON.stringify(results)}</pre>
        </div>
      </div>
      <Desktop />
    </>
  );
}
