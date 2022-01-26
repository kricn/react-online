import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

/**
 * useUnmounted
 * @returns boolean
 * whether the component is unmounted
 */
export function useUnmounted() {
  const unmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  return unmountedRef.current;
}
/**
 * @method useAsyncState
 */
export function useAsyncState<S>(initialState?: S | (() => S)): [S | undefined, Dispatch<SetStateAction<S>>] {
  const unmountedRef = useUnmounted();
  const [state, setState] = useState(initialState);
  const setAsyncState = useCallback((s) => {
    if (unmountedRef) return;
    setState(s);
  }, []);
  return [state, setAsyncState];
}