import { redirect } from 'react-router';

export function loader() {
  return redirect('/home');
}

export default function Index() {
  return <div>This page doesn&apos;t exist</div>;
}
