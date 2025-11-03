import {type RefObject, useCallback, useEffect, useState} from "react";

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
export function useIframeCommunicator(targetOrigin = '*') {
    // Check if we are running *inside* an iframe (for receiving messages)
    const isInsideIframe = window.self !== window.top;

    const [latestMessage, setLatestMessage] = useState(null);
    const [messageError, setMessageError] = useState("");

    // --- Receiving Logic (Same as before, for when the app is *inside* an iframe) ---

    const handleMessage = useCallback((event: MessageEvent) => {
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
    const sendMessage = useCallback((iframeRef: RefObject<HTMLIFrameElement>, data: never) => {
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
}

export default useIframeCommunicator;