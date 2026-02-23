/* eslint-disable react-hooks/set-state-in-effect */
// components/Portal.tsx
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? ReactDOM.createPortal(
    children,
    document.body
  ) : null;
};

export default Portal;