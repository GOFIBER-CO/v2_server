export default function <T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
}
