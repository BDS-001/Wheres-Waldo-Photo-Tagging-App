import { useEffect, useRef } from 'react';
import { heartbeat } from '../services/gameService';

export const useHeartbeat = (isGameActive = false, interval = 30000) => {
    const heartbeatInterval = useRef(null);

    useEffect(() => {
        const startHeartbeat = () => {
            // Clear any existing interval
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }

            // Only start the heartbeat if the game is active
            if (isGameActive) {
                // Initial heartbeat
                heartbeat().catch(error => {
                    console.error('Heartbeat failed:', error);
                });

                // Set up regular heartbeat interval
                heartbeatInterval.current = setInterval(() => {
                    heartbeat().catch(error => {
                        console.error('Heartbeat failed:', error);
                    });
                }, interval);
            }
        };

        startHeartbeat();

        // Cleanup function
        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
        };
    }, [isGameActive, interval]);

    return null;
};