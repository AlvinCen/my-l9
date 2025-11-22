
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function encodeToUrl(data: any): string {
    try {
        const jsonString = JSON.stringify(data);
        return btoa(jsonString);
    } catch (e) {
        console.error("Failed to encode data to URL", e);
        return "";
    }
}

export function decodeFromUrl<T,>(encoded: string): T | null {
    try {
        const jsonString = atob(encoded);
        return JSON.parse(jsonString) as T;
    } catch (e) {
        console.error("Failed to decode data from URL", e);
        return null;
    }
}
