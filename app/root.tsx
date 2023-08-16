import { json, defer } from '@remix-run/node';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { Await } from '@remix-run/react/dist/components';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

let render = 0;

async function asyncRoot() {
  console.log('Fetching layout...........');
  render++;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return `layout render ${render}`;
}

export async function loader({}) {
  // return json({
  //   root: await asyncRoot(),
  //   deferred: false,
  // });
  return defer({
    root: asyncRoot(),
    deferred: true,
  });
}

export default function App() {
  const { root, deferred } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ border: '3px solid black', padding: '1rem' }}>
          <Suspense fallback="Loading root..">
            {deferred ? (
              <Await resolve={root}>{(root) => <p>{root}</p>}</Await>
            ) : (
              <p>{root}</p>
            )}
          </Suspense>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}
