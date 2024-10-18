import { staticConfig } from "./config";

/**
 * Check if a value is defined (not undefined or null).
 * 
 * @param value - The value to check.
 * @returns true if the value is defined, false otherwise.
 */
export function isset(value: any): boolean {
    return value !== undefined && value !== null;
}

/**
 * Converts a number or a string representation of a number to an integer.
 * 
 * @param value - The number or string to convert.
 * @returns the integer value of the input.
 * - If the input is a number, it returns the floor value. 
 * - If the input is a string, it parses it to an integer. 
 * - If the input is neither, it returns 0.
 */
export function toInt(value: number | string): number {
    try {
        if (typeof value === 'number') {
            return Math.floor(value);
        } else if (typeof value === 'string') {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
                throw new Error(`Cannot parse '${value}' to an integer.`);
            }
            return parsed;
        }
        return 0;
    } catch (err) {
        console.error("Error in toInt function:", err);
        return 0;
    }
}

/**
 * Create a deep clone of an object, handling circular references.
 * 
 * @param obj - The object to clone.
 * @returns a deep clone of the input object.
 */

export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
// export function clone<T>(obj: T): T {
//     if (!isset(obj) || typeof obj !== 'object') {
//         return obj;
//     }

//     // Keep track of objects that have already been seen.
//     const seen = new WeakMap<object, object>();

//     // Recursive function to handle the deep cloning of objects.
//     function recursiveClone(value: any): any {
//         if (!isset(null) || typeof value !== 'object') {
//             return value;
//         }

//         if (seen.has(value)) {
//             return seen.get(value);
//         }

//         // Create a new object or array based on the value's type.
//         const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
//         seen.set(value, copy);

//         // Recursively clone each property of the object.
//         for (const key of Object.keys(value)) {
//             copy[key] = recursiveClone(value[key]);
//         }

//         return copy;
//     }

//     return recursiveClone(obj);
// }

/**
 * Insert an element or multiple elements at the beginning of an array.
 * 
 * @param array - The array to modify.
 * @param elements - The single element or multiple elements to insert.
 * @returns the modified array or undefined if the elements are not defined.
 */
export function unshift<T>(array: T[], elements: T | T[]): T[] | undefined {
    if (!isset(elements))
        return;

    const itemsToInsert = Array.isArray(elements) ? elements : [elements];
    itemsToInsert.reverse().forEach(item => {
        array.unshift(item);
    });

    return array;
}


/** 
 * Converts an RGB color represented as an array of three numbers into 
 * a hexadecimal color string.
 * 
 * @param color - An array containing the red, green, and blue components
 *  of the color, each ranging from 0 to 255.
 * @returns A string representing the color in hexadecimal format 
 * (e.g., '#RRGGBB').
 */
export function colorArrayToRGB(color: number[]): string {
    const clamp = (value: number) => Math.max(0, Math.min(255, value));

    const nowR = clamp(color[0]);
    const nowG = clamp(color[1]);
    const nowB = clamp(color[2]);

    return `#${((1 << 24) + (nowR << 16) + (nowG << 8) + nowB).toString(16).slice(1)}`;
}

/**
 * Get the storage key for a given key.
 * 
 * @param key - The key to get the storage key for.
 * @returns the storage key for the given key.
 */
function getStorageKey(key: string): string {
    return `${staticConfig.gameVersion}_${key}`;
}

/**
 * Set a value in local storage.
 * 
 * @param key - The key to set.
 * @param value - The value to set.
 */
export function setLocalStorage(key: string, value: any): boolean {
    try {
        localStorage.setItem(getStorageKey(key), JSON.stringify(value));
        return true;
    } catch (err) {
        console.error("set localStorage failed:", err);
        return false;
    }
}

/**
 * Get a value from local storage.
 * 
 * @param key - The key to get.
 * @param defaultValue - The default value to return if the key 
 * is not found in local storage.
 * @returns the value associated with the key in local storage, 
 * or the default value if the key is not found.
 */
export function getLocalStorage(key: string, defaultValue: any = undefined): any {
    try {
        const value = localStorage.getItem(getStorageKey(key));
        return isset(value) ? JSON.parse(value!) : defaultValue;
    } catch (err) {
        console.error("get localStorage failed:", err);
        return defaultValue;
    }
}

/**
 * Remove a value from local storage.
 * 
 * @param key - The key to remove.
 * @returns true if the key was removed successfully, false otherwise.
 */
export function removeLocalStorage(key: string): boolean {
    try {
        localStorage.removeItem(getStorageKey(key));
        return true;
    } catch (err) {
        console.error("remove localStorage failed:", err);
        return false;
    }
}

/**
 * Format a Date object into a string representation.
 * 
 * @param date - The Date object to format.
 * @returns a formatted string in the format 'YYYY-MM-DD HH:mm:ss' 
 * or an empty string if the date is not set.
 */
export function formatDate(date?: Date) {
    if (!isset(date))
        return "";
    const year = date!.getFullYear();
    const month = (date!.getMonth() + 1).toString().padStart(2, '0');
    const day = date!.getDate().toString().padStart(2, '0');
    const hour = date!.getHours().toString().padStart(2, '0');
    const minute = date!.getMinutes().toString().padStart(2, '0');
    const second = date!.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Defines a decorator that can be applied to class properties
// to prevent them from being modified, ensuring their values remain constant.
export function readonly(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        writable: false
    });
}

/**
 * A decorator function that traces the caller of a method and logs the information.
 * This function wraps the original method to capture the call stack and log the 
 * caller's information. It also handles any errors that occur during the execution 
 * of the original method.
 * 
 * @param target - The target object that the method belongs to.
 * @param propertyKey - The name of the method being decorated.
 * @param descriptor - The property descriptor for the method.
 * @returns The updated property descriptor with the wrapped method.
 */
export function callertrace(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        try {
            const stack = new Error().stack;
            const caller = stack?.split('\n')[2]?.trim() || 'Unknown';

            console.log(`Method ${propertyKey} was called by:`, caller);

            return originalMethod.apply(this, args);
        } catch (err) {
            console.error(`Error in method ${propertyKey}:`, err);
            throw err;
        }
    };

    return descriptor;
}

/**
 * A method decorator that logs the parameters and the property key of the method being called.
 * @param target - The prototype of the class for the method being decorated.
 * @param propertyKey - The name of the method being decorated.
 * @param descriptor - The property descriptor for the method.
 * @returns The modified property descriptor that includes logging functionality.
 */
export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const params = args.map((arg, index) => `param${index + 1}: ${JSON.stringify(arg)}`).join(', ');
        console.log(`${propertyKey} (${params})`);

        return originalMethod.apply(this, args);
    };

    return descriptor;
}

/**
 * logs the call of a given function along with its arguments.
 * 
 * @param fn - The function to log.
 * @returns a new function that includes logging functionality.
 */
export function logFunctionCall(fn: Function) {
    return function (...args: any[]) {
        const params = args.map((arg, index) => `param${index + 1}: ${JSON.stringify(arg)}`).join(', ');
        console.log(`Calling ${fn.name} with ${params}`);

        return fn(...args);
    };
}

/**
 * log the execution time of a given function
 * 
 * @param fn - The function to log.
 * @returns a new function that wraps the original function, measuring its 
 * execution time
 */

export function logExecutionTime(fn: Function) {
    return function (...args: any[]) {
        const start = performance.now();

        const result = fn(...args);

        const end = performance.now();
        console.log(`Function ${fn.name} executed in ${(end - start).toFixed(2)} milliseconds.`);

        return result;
    };
}

/**
 * Imports all the modules matched by the Webpack require context.
 * 
 * @param r - The Webpack require context.
 * @returns an array of the imported modules.
 */
export function importAll(r: __WebpackModuleApi.RequireContext) {
    return r.keys().map((key) => ({
        path: key,
        module: r(key)
    }));
}