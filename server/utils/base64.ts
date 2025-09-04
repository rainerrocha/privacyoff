export const atob = (str: string) => Buffer.from(str, 'base64').toString('utf-8')
export const btoa = (str: string) => Buffer.from(str).toString('base64').replace(/=/g, '')
