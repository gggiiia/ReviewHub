// components/NotIframe.jsx
import React from 'react';
import {isInIframe} from "@/lib/utils.ts";

const NotIframe = ({ children }) => {
    return !isInIframe() ? <>{children}</> : null;
};

export default NotIframe;
