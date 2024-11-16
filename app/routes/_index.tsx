import { redirect } from "@remix-run/react";

export function loader() {
  return redirect(" /website");
}

export default function Index() {
  return <div>Something went wrong</div>;
}
