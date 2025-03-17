import { useEffect } from 'react';
const useTabPrevention = (showModal: boolean): void => {
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    };
    useEffect(() => {
        if (showModal) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModal]);
};
export default useTabPrevention;