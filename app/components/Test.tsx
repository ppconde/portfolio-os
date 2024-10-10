import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface Env {
    DB: D1Database;
}

export const loader: LoaderFunction = async ({ context }) => {
    const env = context.cloudflare.env as Env;

    const { results } = await env.DB.prepare("SELECT * FROM Customers LIMIT 5").all();
    return json(results);
};

export default function Test() {
    const results = useLoaderData<typeof loader>();
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <h1>Welcome to Remix</h1>
            <div>
                A value from D1:
                <pre>{JSON.stringify(results)}</pre>
            </div>
        </div>
    );
}