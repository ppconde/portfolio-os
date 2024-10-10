import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ context, params }) => {
    const { env } = context.cloudflare;
    const { results } = await env.DB.prepare(
        "SELECT * FROM Customers"
    ).bind(params.productId).all();
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