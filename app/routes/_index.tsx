import { redirect } from "@remix-run/react";

/**
 * Not sure if this is the best approach,
 * but I'm forced to have this index file,
 * however it can't have any child routes'
 */
export function loader() {
  return redirect(" /website");
}

export default function Index() {
  return <div>Something went wrong</div>;
}
