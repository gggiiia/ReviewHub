import {type PropsWithChildren} from 'react';
import {useIsDesktop} from "@/lib/hooks.ts";


/**
 * Component that renders its children only on desktop screens (>= 1024px).
 */
const IsDesktop = ({ children }:PropsWithChildren) => {
    const isDesktop = useIsDesktop();

    return isDesktop ? <>{children}</> : null;
};

export default IsDesktop;