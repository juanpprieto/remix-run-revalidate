import { json } from '@remix-run/node';

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return json({ hello: 'world' });
}

export async function action() {
  return json({ hello: 'action' });
}
