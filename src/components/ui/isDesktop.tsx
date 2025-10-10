import React from 'react';
import {useIsDesktop} from "@/lib/hooks.ts";


/**
 * Component that renders its children only on desktop screens (>= 1024px).
 */
const IsDesktop = ({ children }) => {
    const isDesktop = useIsDesktop();

    return isDesktop ? <>{children}</> : null;
};

export default IsDesktop;