import {useCallback, useEffect, useState} from "react";

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
    const handleMessage = useCallback((event: MessageEvent) => {
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
}