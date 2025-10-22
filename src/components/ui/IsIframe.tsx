import {isInIframe} from "@/lib/utils.ts";

const IsIframe = ({ children }) => {
    return isInIframe() ? <>{children}</> : null;
};

export default IsIframe;