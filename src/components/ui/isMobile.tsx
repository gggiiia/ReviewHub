import {type PropsWithChildren} from 'react';

import {useIsDesktop} from "@/lib/hooks/useIsDesktop.tsx";

/**
 * Component that renders its children only on mobile/tablet screens (< 1024px).
 * (Essentially, when useIsDesktop is false).
 */
const IsMobile = ({ children }:PropsWithChildren) => {
    const isDesktop = useIsDesktop();

    // It's considered 'mobile' if it's NOT desktop
    return !isDesktop ? <>{children}</> : null;
};

export default IsMobile;