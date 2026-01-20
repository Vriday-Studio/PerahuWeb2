export const removeAt = (inputText: string) => {
  var atIndex = inputText.indexOf('@')
  if (atIndex !== -1) {
    var result = inputText.substring(0, atIndex)
    return result
  }
  return inputText // If there is no "@" in the string
}

export const removeAuthPrefix = (errorCode: string) => {
  const prefix = 'auth/'
  if (errorCode.startsWith(prefix)) {
    return errorCode.substring(prefix.length)
  }
  return errorCode
}
