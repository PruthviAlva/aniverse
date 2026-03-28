import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timer to update the debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timer if value changes before delay is up
        // This is the key — it resets the countdown on every keystroke
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;