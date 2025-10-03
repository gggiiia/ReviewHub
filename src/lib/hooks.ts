import { useState, useEffect } from 'react';

/**
 * Custom hook to determine if the screen size meets the desktop criteria (>= 1024px).
 * Corresponds to Tailwind CSS 'lg' breakpoint.
 */
const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    // Define the desktop breakpoint size (Tailwind CSS 'lg')
    const DESKTOP_BREAKPOINT = 1024;

    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            // Set the state based on the current window width
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
        };

        // Set initial value on component mount
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty array ensures that effect is run only on mount and unmount

    return isDesktop;
};

export default useIsDesktop;