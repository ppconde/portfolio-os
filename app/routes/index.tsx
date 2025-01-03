import { redirect } from 'react-router';

export function loader() {
  console.log('loading index ');
  return redirect('/website');
}

export default function Index() {
  return <div>This page doesn&apos;t exist</div>;
}
