import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, timeout: number): T => {
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value);

    const handler = setTimeout(() => {
      return setState(value);
    }, timeout);
    return () => clearTimeout(handler);
  }, [value, timeout]);

  return state;
};
