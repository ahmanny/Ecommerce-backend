



// Parse images, colors, and sizes (handle JSON or array formats)
export const parseArray = (data: any) => (typeof data === "string" ? JSON.parse(data) : Array.isArray(data) ? data : []);