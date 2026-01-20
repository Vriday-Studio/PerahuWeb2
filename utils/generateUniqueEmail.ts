import getRandomArbitrary from './getRandomArbitrary'

export const generateUniqueEmail = () => {
  const timenow = new Date().toLocaleString()
  const ranEmail = getRandomArbitrary(10, 999)
  const uniq = 'Email' + ranEmail + timenow
  return uniq
}
