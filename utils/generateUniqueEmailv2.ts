export default function generateUniqueEmailv2(baseEmail: string, length = 8) {
  // Function to generate a random string of alphanumeric characters
  function generateRandomString(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomString = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomString += characters.charAt(randomIndex)
    }
    return randomString
  }

  // Generate a random string and concatenate it with the base email address
  const randomString = generateRandomString(length)
  const uniqueEmail = `${baseEmail}_${randomString}@example.com`

  return uniqueEmail
}
