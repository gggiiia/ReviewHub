import {useState, useEffect, useCallback, type RefObject} from 'react';

/**
 * Custom hook to determine if the screen size meets the desktop criteria (>= 1024px).
 * Corresponds to Tailwind CSS 'lg' breakpoint.
 */
export function useIsDesktop ()  {
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


/**
 * React hook to check if the app is running inside an iframe and, if so,
 * start listening for messages. It processes incoming messages, expecting
 * them to be valid JSON strings, and transforms them into JavaScript objects.
 *
 * @returns {{
 * isInsideIframe: boolean,
 * latestMessage: Object | null,
 * messageError: string | null
 * }} An object containing:
 * - isInsideIframe: true if the window is inside an iframe.
 * - latestMessage: The latest valid JSON message parsed into an object, or null.
 * - messageError: Any error encountered during message processing (e.g., invalid JSON).
 */
export function useIframeMessageListener<T>() {
    // Check if the current window is *not* the top-level window (i.e., it's inside an iframe)
    const isInsideIframe = window.self !== window.top;

    const [latestMessage, setLatestMessage] = useState<T | null>(null);
    const [messageError, setMessageError] = useState<string | null>("");

    // The main message handler logic
    const handleMessage = useCallback((event:MessageEvent) => {
        // Basic security check: Consider restricting origins (e.g., if (event.origin !== "http://expected-domain.com"))
        // For this example, we'll process the message regardless of origin.

        // Reset error state for the new message
        setMessageError(null);

        // Ensure data exists and is a string, as we expect JSON strings
        if (typeof event.data === 'string') {
            try {
                // Attempt to parse the JSON string into an object
                const parsedData = JSON.parse(event.data);

                // Check if the parsing was successful and the result is a plain object
                if (typeof parsedData === 'object' && parsedData !== null) {
                    // Valid JSON object received
                    setLatestMessage(parsedData);
                } else {
                    // Data was a string but not a JSON object (e.g., 'null', '123', or a plain string)
                    setMessageError('Message is a valid string but not a valid JSON object representation.');
                    setLatestMessage(null);
                }
            } catch (e) {
                // JSON parsing failed
                if (e instanceof Error) {
                    setMessageError(`Error parsing message data as JSON: ${e.message}`);
                    setLatestMessage(null);
                }
            }
        } else {
            // Data is not a string (e.g., an object sent directly via postMessage)
            setMessageError('Received message data is not a string (expected JSON string).');
            setLatestMessage(null);
        }
    }, []); // Dependencies are empty as it doesn't rely on outside state/props

    useEffect(() => {
        if (isInsideIframe) {
            console.log('Running inside an iframe. Starting message listener...');
            // Start listening for messages
            window.addEventListener('message', handleMessage);

            // Cleanup function: stop listening when the component unmounts or dependencies change
            return () => {
                console.log('Cleaning up message listener...');
                window.removeEventListener('message', handleMessage);
            };
        } else {
            console.log('Not running inside an iframe. Message listener not started.');
        }
        // Only re-run if handleMessage changes (which it won't due to useCallback) or isInsideIframe changes
    }, [isInsideIframe, handleMessage]);

    return {
        isInsideIframe,
        latestMessage,
        messageError,
    };
};

/**
 * React hook to check if the app is running inside an iframe, listen for incoming
 * messages, and provide a function to send messages to a *target* iframe.
 *
 * NOTE: When used in the PARENT window, the 'sendMessage' function is available.
 * NOTE: When used in the IFRAME window, the 'latestMessage' listener is active.
 *
 * @param {string} targetOrigin The required origin of the iframe content for postMessage.
 * (e.g., 'https://trusted-domain.com' or '*' for any. '*' is discouraged).
 * @returns {{
 * isInsideIframe: boolean,
 * latestMessage: Object | null,
 * messageError: string | null,
 * sendMessage: (iframeRef: React.RefObject<HTMLIFrameElement>, data: Object) => void
 * }}
 */
export function useIframeCommunicator(targetOrigin = '*')  {
    // Check if we are running *inside* an iframe (for receiving messages)
    const isInsideIframe = window.self !== window.top;

    const [latestMessage, setLatestMessage] = useState(null);
    const [messageError, setMessageError] = useState("");

    // --- Receiving Logic (Same as before, for when the app is *inside* an iframe) ---

    const handleMessage = useCallback((event:MessageEvent) => {
        // Security Note: In a real app, you should validate event.origin here.
        setMessageError("");

        if (typeof event.data === 'string') {
            try {
                const parsedData = JSON.parse(event.data);
                if (typeof parsedData === 'object' && parsedData !== null) {
                    setLatestMessage(parsedData);
                } else {
                    setMessageError('Message is a valid string but not a valid JSON object representation.');
                    setLatestMessage(null);
                }
            } catch (e) {
                if (e instanceof Error) {
                    setMessageError(`Error parsing message data as JSON: ${e.message}`);
                    setLatestMessage(null)
                }
            }
        } else {
            setMessageError('Received message data is not a string (expected JSON string).');
            setLatestMessage(null);
        }
    }, []);

    useEffect(() => {
        if (isInsideIframe) {
            window.addEventListener('message', handleMessage);
            return () => {
                window.removeEventListener('message', handleMessage);
            };
        }
    }, [isInsideIframe, handleMessage]);


    // --- Sending Logic (For when the app is the PARENT and needs to send a message) ---

    /**
     * Sends a JavaScript object as a JSON string to the target iframe.
     *
     * @param {React.RefObject<HTMLIFrameElement>} iframeRef A ref attached to the target <iframe> element.
     * @param {Object} data The object to be stringified and sent.
     */
    const sendMessage = useCallback((iframeRef:RefObject<HTMLIFrameElement>, data: never) => {
        if (!iframeRef || !iframeRef.current) {
            console.error('Iframe reference is missing or invalid.');
            return;
        }

        const iframeWindow = iframeRef.current.contentWindow;

        if (!iframeWindow) {
            console.error('Could not get contentWindow from the iframe ref.');
            return;
        }

        try {
            // 1. Transform the JavaScript object into a JSON string
            const jsonString = JSON.stringify(data);

            // 2. Use postMessage to send the string to the iframe
            // Arguments: postMessage(message, targetOrigin)
            iframeWindow.postMessage(jsonString, targetOrigin);
            // console.log(`Message sent to iframe with origin ${targetOrigin}:`, jsonString);

        } catch (error) {
            console.error('Failed to stringify or send message to iframe:', error);
        }
    }, [targetOrigin]); // Recreate if targetOrigin changes

    // --- Return Values ---

    return {
        isInsideIframe,
        latestMessage,
        messageError,
        sendMessage, // The function provided to the parent component
    };
};

export default useIframeCommunicator;