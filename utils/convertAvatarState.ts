export function convertStateToArray(state: any) {
  let myArray = []
  console.log('state', state)
  const gender = state?.gender ? 'male' : 'female'

  // Index 0: Gender
  myArray.push(state?.gender ? 1 : 0)

  // Index 1: Hair

  let hairIndex = state.avatarState[gender].hair.no || 0
  myArray.push(hairIndex)

  // Index 2: Hat
  let hatIndex = state.avatarState[gender].hat.no || 0
  myArray.push(hatIndex)

  // Index 3-6: Mouth, Eyebrow, Eyes, Nose,l
  let facialFeatures = ['mouth', 'eyebrow', 'eyes', 'nose']
  facialFeatures.forEach((feature) => {
    let featureIndex = state.avatarState[gender][feature].no || 0
    myArray.push(featureIndex)
  })

  // Index 7-9: Cloth, Pant, Shoe
  let clothingItems = ['shirt', 'pants', 'shoes']

  clothingItems.forEach((item) => {
    let itemIndex = state.avatarState[gender][item].no || 0
    myArray.push(itemIndex)
    console.log("itemIndex="+itemIndex)
  })

  // Index 10: isOverall
  myArray.push(state.avatarState[gender].isOverall)

  // Index 11: Overall
  let overallIndex = state.avatarState[gender].clothes.no || 0
  myArray.push(overallIndex)

  // Index 12: Accessories

  let accessoryIndex = state.avatarState[gender].accessories.no || 0
  myArray.push(accessoryIndex)

  // Index 13: isHat
  myArray.push(
    state.avatarState[gender].hat.path !== '' && state.avatarState[gender].isHat === 1 ? 1 : 0
  )

  // Index 14: isAcc
  myArray.push(
    state.avatarState[gender].accessories.path !== '' && state.avatarState[gender].isAcc === 1
      ? 1
      : 0
  )

  console.log('avatar array', myArray)
  //convert the array back to string
  return myArray.join(',')
}
