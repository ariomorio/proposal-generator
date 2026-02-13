import { useState, useCallback } from 'react';
import { validateAll } from '../utils/validators';

export function useValidation() {
    const [errors, setErrors] = useState({});

    const validate = useCallback((formData, chapters) => {
        const newErrors = validateAll(formData, chapters);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const hasErrors = Object.keys(errors).length > 0;

    const getErrorCount = useCallback(() => {
        let count = 0;
        const countObj = (obj) => {
            Object.values(obj).forEach(v => {
                if (typeof v === 'object' && !Array.isArray(v)) countObj(v);
                else if (Array.isArray(v)) v.forEach(item => { if (item && typeof item === 'object') countObj(item); else if (item) count++; });
                else if (v) count++;
            });
        };
        countObj(errors);
        return count;
    }, [errors]);

    return { errors, validate, clearErrors, hasErrors, getErrorCount };
}
