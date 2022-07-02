import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

/**
 * @method useAsyncState
 */
export function useAsyncState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const unmountedRef = useRef<boolean>(false);
  const [state, setState] = useState(initialState);
  const setAsyncState = useCallback((s: any) => {
    if (unmountedRef.current) return;
    setState(s);
  }, []);

  useEffect(() => {
    return () => {
      unmountedRef.current = true
    }
  }, [])
  return [state, setAsyncState];
}