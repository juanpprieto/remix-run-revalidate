import { json, defer } from '@remix-run/node';
import { Link, Await } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react/dist/components';
import { Suspense } from 'react';

async function asyncTest() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return '123';
}

export async function loader() {
  // return json({
  //   test: await asyncTest(),
  //   deferred: false,
  // });
  return defer({
    test: asyncTest(),
    deferred: true,
  });
}

export default function TestRoute() {
  const { test, deferred } = useLoaderData();
  return (
    <div>
      <h1>Another route</h1>
      <Suspense fallback="Loading test..">
        {deferred ? (
          <Await resolve={test}>
            {(test) => <pre>{JSON.stringify(test, null, 2)}</pre>}
          </Await>
        ) : (
          <pre>{JSON.stringify(test, null, 2)}</pre>
        )}
      </Suspense>
      <br />
      <Link to="/">Home</Link>
    </div>
  );
}
