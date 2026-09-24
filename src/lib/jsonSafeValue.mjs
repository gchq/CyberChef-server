/**
 * Converts values that are not directly JSON serialisable to a JSON-safe form.
 * @param {*} value
 * @returns {*}
 */
export default function jsonSafeValue(value) {
    if (value instanceof ArrayBuffer) {
        return Array.from(new Uint8Array(value));
    }
    return value;
}
