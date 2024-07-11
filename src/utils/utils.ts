import validator from 'validator'

export const isUrl = (link: string): boolean => {
  return (
    validator.isURL(link) &&
    (link.includes('youtube.com') || link.includes('youtu.be'))
  )
}
