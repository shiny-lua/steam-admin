export const sliceText = (text: string, len: number) => {
    if (!text) return ''
    return (text.length > len ? text.slice(0, len) + '...' : text)
}

export const textEllipsis = (text: string = "", start: number = 7, end: number = 5) => {
    if (text.length > (start + end)) {
        return `${text.slice(0, start)}...${end ? text.slice(-1 * end) : ''}`
    }

    return text;
}
