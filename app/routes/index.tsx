import { Link, redirect } from "react-router";

/**
 * Not sure if this is the best approach,
 * but I'm forced to have this index file,
 * however it can't have any child routes'
 */
export function loader() {
  return redirect(" /website");
}

export default function Index() {
  return <div>You are being redirected to <Link to="website" className="text-blue-500 hover:text-blue-700 visited:text-purple-600">/website</Link></div>;
}
