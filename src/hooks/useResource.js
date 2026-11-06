import { useCallback, useEffect, useState } from 'react';
// A keyed child remount clears previous data on query/account changes. Requests cancel on unmount.
export default function useResource(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    loader(controller.signal).then(data => {
      if (!controller.signal.aborted) setState({ data, loading: false, error: '' });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: error.message });
    });
    return () => controller.abort();
  }, [loader, revision]);
  return { ...state, reload };
}
