import type { MetaFunction } from "@remix-run/cloudflare";
import Desktop from "~/components/Desktop";

export const meta: MetaFunction = () => {
  return [
    { title: "Ppconde OS" },
    { name: "description", content: "Welcome to Ppconde OS" },
  ];
};

export default function Index() {
  return (
    <Desktop />
  );
}


