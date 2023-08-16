import type { V2_MetaFunction } from '@remix-run/node';
import { useFetcher, useFetchers } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

function useActionFetchers(actionName: string) {
  const fetchers = useFetchers();
  return fetchers.filter((fetcher) => {
    const formData = fetcher.submission?.formData;
    if (formData && formData.get('hiddenAction') === actionName) {
      return true;
    }
    return false;
  });
}

function useIsActionLoading() {
  const fetchers = useActionFetchers('ACTION');
  return Boolean(
    fetchers.find(
      (fetcher) => fetcher.state === 'loading' || fetcher.state === 'submitting'
    )
  );
}

export default function Index() {
  const fastFetcher = useFetcher();
  const slowFetcher = useFetcher();
  const actionFetcher = useFetcher();
  const actionIsLoading = useIsActionLoading();

  useEffect(() => {
    if (fastFetcher.data || fastFetcher.state === 'loading') return;
    fastFetcher.load('/api/fast-endpoint');
  }, [fastFetcher]);

  useEffect(() => {
    if (slowFetcher.data || slowFetcher.state === 'loading') return;
    slowFetcher.load('/api/slow-endpoint');
  }, [slowFetcher]);

  const style = {
    height: '2rem',
  };

  const fastFetcherIdle = fastFetcher.state === 'idle' && fastFetcher.data;
  const slowFetcherIdle = slowFetcher.state === 'idle' && slowFetcher.data;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <p
        style={{
          ...style,
          backgroundColor: fastFetcherIdle ? 'green' : 'yellow',
        }}
      >
        GET / fast req
      </p>
      <p
        style={{
          ...style,
          backgroundColor: slowFetcherIdle ? 'green' : 'yellow',
        }}
      >
        Get / slow req
      </p>
      <p
        style={{
          ...style,
          backgroundColor: actionIsLoading ? 'yellow' : 'green',
        }}
      >
        POST / req
      </p>
      <Link to="/test">Test</Link>
      <actionFetcher.Form action="/api/fast-endpoint" method="post">
        <input type="hidden" name="hiddenAction" value="ACTION" />
        <button type="submit">Click me</button>
      </actionFetcher.Form>
    </div>
  );
}
