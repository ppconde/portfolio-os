import type { MetaFunction } from "@remix-run/cloudflare";
import Desktop from "~/components/Desktop";
import Test from "~/components/Test";

export const meta: MetaFunction = () => {
  return [
    { title: "Ppconde OS" },
    { name: "description", content: "Welcome to Ppconde OS" },
  ];
};

export default function Index() {
  return (
    <>
      <Test />
      <Desktop />
    </>
  );
}


