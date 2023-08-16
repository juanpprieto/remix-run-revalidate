import { json, defer } from '@remix-run/node';

// export const shouldRevalidate = () => false;

export async function loader() {
  // timeout to hold thread for 3 seconds
  return json({ hello: await asyncHello() });
  // return defer({ hello: asyncHello() });
}

async function asyncHello() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return 'world';
}
