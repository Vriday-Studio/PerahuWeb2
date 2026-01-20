import DOMPurify from 'dompurify'

export const sanitizeDOM = (html: string = '', opt: Record<string, any> = {}) => {
  if (typeof window === 'undefined') {
    return html
  }
  return DOMPurify.sanitize(html, opt)
}
