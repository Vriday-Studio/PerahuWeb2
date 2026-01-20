import { string, set } from 'zod'
import { create } from 'zustand'
import { persist, createJSONStorage, devtools, PersistOptions } from 'zustand/middleware'

type TParams = {
  path: string
  sub_path?: string
  display_path?: string
  gender?: string
  no: number
}

type PlayerBuildState = {
  [gender: string]: {
    [category: string]: TParams
  }
}

type AvatarStore = {
  gender: boolean
  setGender: () => void
  currentAvatarState: {
    gender?: number
    hair: TParams
    hat: TParams
    mouth: TParams
    eyebrow: TParams
    eyes: TParams
    nose: TParams
    shirt: TParams
    pants: TParams
    shoes: TParams
    isOverall?: number
    clothes: TParams
    accessories: TParams
    isHat?: number
    isAcc?: number
  }
  avatarState: {
    [gender: string]: {
      gender?: number
      hair: TParams
      hat: TParams
      mouth: TParams
      eyebrow: TParams
      eyes: TParams
      nose: TParams
      shirt: TParams
      pants: TParams
      shoes: TParams
      isOverall?: number
      clothes: TParams
      accessories: TParams
      isHat?: number
      isAcc?: number
    }
  }
  initializeCurrentAvatarState: (avatar: number[]) => void
  initializeAvatarState: () => void
  setAvatarState: (item: TParams) => Promise<void>
  // playerBuild: PlayerBuildState
  // setPlayerBuild: (params: TParams) => Promise<void>k
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const persistOptions: PersistOptions<AvatarStore, any> = {
  name: 'avatar-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ ...state }),
  onRehydrateStorage: () => (state) => {
    state?.setHasHydrated(true)
  },
}

type TCategory = {
  category: string
  setCategory: (category: string) => void
  avatarData: any
  fetchAvatarData: any
}

export const useAvatarCategoryStore = create<TCategory>((set) => ({
  category: 'hair',
  setCategory: (newCategory: string) => set({ category: newCategory }),
  avatarData: null,
  fetchAvatarData: async () => {
    const currentGender = useAvatarStore.getState().gender ? 'male' : 'female'
    const currentCategory = useAvatarCategoryStore.getState().category
    try {
      const response = await fetch('/api/avatar')
      const items = await response.json()

      if (currentCategory in items) {
        const filteredItems = items[currentCategory].filter(
          (item: { gender: string }) => item.gender === currentGender || item.gender === 'unisex'
        )
        set({ avatarData: filteredItems })
      } else {
        console.error('Error: Category not found in response data')
      }
    } catch (error) {
      console.error('Error fetching avatar data:', error)
    }
  },
}))

export const useAvatarStore = create(
  devtools(
    persist<AvatarStore>(
      (set) => ({
        gender: true,
        setGender: () => set((state: { gender: boolean }) => ({ gender: !state.gender })),
        // playerBuild: {
        //   male: {
        //     hat: {
        //       path: '',
        //     },
        //     hair: {
        //       path: '/assets/avatar/unisex/hair/hairm1.png',
        //     },
        //     eyebrow: {
        //       path: '/assets/avatar/unisex/eyebrow/brow1.png',
        //     },
        //     eyes: {
        //       path: '/assets/avatar/unisex/eyes/eye1.png',
        //     },
        //     nose: {
        //       path: '/assets/avatar/unisex/nose/nose1.png',
        //     },
        //     mouth: {
        //       path: '/assets/avatar/unisex/mouth/mouth1.png',
        //     },
        //     shirt: {
        //       path: '/assets/avatar/unisex/shirt/bajum1.png',
        //     },
        //     pants: {
        //       path: '/assets/avatar/unisex/pants/pantm1.png',
        //     },
        //     clothes: {
        //       path: '',
        //     },
        //     shoes: {
        //       path: '/assets/avatar/unisex/shoes/shoe_m1.png',
        //     },
        //     accessories: {
        //       path: '',
        //     },
        //   },
        //   female: {
        //     hat: {
        //       path: '',
        //     },
        //     hair: {
        //       path: '/assets/avatar/unisex/hair/hairf1.png',
        //     },
        //     eyebrow: {
        //       path: '/assets/avatar/unisex/eyebrow/brow1.png',
        //     },
        //     eyes: {
        //       path: '/assets/avatar/unisex/eyes/eye12.png',
        //     },
        //     nose: {
        //       path: '/assets/avatar/unisex/nose/nose1.png',
        //     },
        //     mouth: {
        //       path: '/assets/avatar/unisex/mouth/mouth1.png',
        //     },
        //     shirt: {
        //       path: '/assets/avatar/unisex/shirt/bajuf2.png',
        //     },
        //     pants: {
        //       path: '/assets/avatar/unisex/pants/pantf1.png',
        //     },
        //     clothes: {
        //       path: '',
        //     },
        //     shoes: {
        //       path: '/assets/avatar/unisex/shoes/shoe_f1.png',
        //     },
        //     accessories: {
        //       path: '',
        //     },
        //   },
        // },
        currentAvatarState: {
          gender: 0,
          hair: { no: 0, path: '' },
          hat: { no: 0, path: '' },
          mouth: { no: 0, path: '' },
          eyebrow: { no: 0, path: '' },
          eyes: { no: 0, path: '' },
          nose: { no: 0, path: '' },
          shirt: { no: 0, path: '' },
          pants: { no: 0, path: '' },
          shoes: { no: 0, path: '' },
          isOverall: 0,
          clothes: { no: 0, path: '' },
          accessories: { no: 0, path: '' },
          isHat: 0,
          isAcc: 0,
        },
        avatarState: {
          male: {
            gender: 0,
            hair: { no: 13, path: '' },
            hat: { no: 0, path: '' },
            mouth: { no: 0, path: '' },
            eyebrow: { no: 1, path: '' },
            eyes: { no: 10, path: '' },
            nose: { no: 0, path: '' },
            shirt: { no: 0, path: '' },
            pants: { no: 0, path: '' },
            shoes: { no: 0, path: '' },
            isOverall: 0,
            clothes: { no: 0, path: '' },
            accessories: { no: 0, path: '' },
            isHat: 0,
            isAcc: 0,
          },
          female: {
            gender: 0,
            hair: { no: 0, path: '' },
            hat: { no: 0, path: '' },
            mouth: { no: 0, path: '' },
            eyebrow: { no: 0, path: '' },
            eyes: { no: 0, path: '' },
            nose: { no: 0, path: '' },
            shirt: { no: 0, path: '' },
            pants: { no: 0, path: '' },
            shoes: { no: 0, path: '' },
            isOverall: 0,
            clothes: { no: 0, path: '' },
            accessories: { no: 0, path: '' },
            isHat: 0,
            isAcc: 0,
          },
        },
        initializeCurrentAvatarState: async (Avatar: number[]) => {
          const response = await fetch('/api/avatar')
          const items = await response.json()

          const currentUserAvatar = Avatar

          const [
            gender,
            hair,
            hat,
            mouth,
            brows,
            eye,
            nose,
            shirt,
            pant,
            shoe,
            isOverall,
            clothes,
            accessories,
            isHat,
            isAcc,
          ] = currentUserAvatar.map(Number)

          //Find the corresponding item in the fetched data
          const hairItem = items['hair'].find((item: { no: number }) => item.no === hair)
          const hatItem = items['hat'].find((item: { no: number }) => item.no === hat)
          const mouthItem = items['mouth'].find((item: { no: number }) => item.no === mouth)
          const eyebrowItem = items['eyebrow'].find((item: { no: number }) => item.no === brows)
          const eyeItem = items['eyes'].find((item: { no: number }) => item.no === eye)
          const noseItem = items['nose'].find((item: { no: number }) => item.no === nose)
          const shirtItem = items['shirt'].find((item: { no: number }) => item.no === shirt)
          const pantItem = items['pants'].find((item: { no: number }) => item.no === pant)
          const shoeItem = items['shoes'].find((item: { no: number }) => item.no === shoe)
          const clothesItem = items['clothes'].find((item: { no: number }) => item.no === clothes)
          const accessoriesItem = items['accessories'].find(
            (item: { no: number }) => item.no === accessories
          )

          const currentGender = gender ? 'male' : 'female'

          set(() => ({ gender: currentGender === 'male' }))

          set((state) => ({
            avatarState: {
              ...state.avatarState,
              [currentGender]: {
                ...state.avatarState[currentGender],
                gender: gender,
                hair: hairItem,
                hat: hatItem,
                mouth: mouthItem,
                eyebrow: eyebrowItem,
                eyes: eyeItem,
                nose: noseItem,
                shirt: shirtItem,
                pants: pantItem,
                shoes: shoeItem,
                isOverall: isOverall,
                clothes: clothesItem,
                accessories: accessoriesItem,
                isHat: isHat,
                isAcc: isAcc,
              },
            },
          }))

          set((state) => ({
            currentAvatarState: {
              ...state.currentAvatarState,
              gender: gender,
              hair: hairItem,
              hat: hatItem,
              mouth: mouthItem,
              eyebrow: eyebrowItem,
              eyes: eyeItem,
              nose: noseItem,
              shirt: shirtItem,
              pants: pantItem,
              shoes: shoeItem,
              isOverall: isOverall,
              clothes: clothesItem,
              accessories: accessoriesItem,
              isHat: isHat,
              isAcc: isAcc,
            },
          }))
        },
        initializeAvatarState: async () => {
          const response = await fetch('/api/avatar')
          const items = await response.json()

          // default for male and female
          const defaultMaleAvatar = [1, 13, 0, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          const defaultFemaleAvatar = [0, 0, 0, 0, 0, 10, 0, 12, 12, 12, 0, 0, 0, 0, 0]

          const currentGender = !useAvatarStore.getState().gender ? 'male' : 'female'

          const defaultAvatar = currentGender === 'male' ? defaultMaleAvatar : defaultFemaleAvatar

          const [
            gender,
            hair,
            hat,
            mouth,
            brows,
            eye,
            nose,
            shirt,
            pant,
            shoe,
            isOverall,
            clothes,
            accessories,
            isHat,
            isAcc,
          ] = defaultAvatar.map(Number)

          //Find the corresponding item in the fetched data
          const hairItem = items['hair'].find((item: { no: number }) => item.no === hair)
          const hatItem = items['hat'].find((item: { no: number }) => item.no === hat)
          const mouthItem = items['mouth'].find((item: { no: number }) => item.no === mouth)
          const eyebrowItem = items['eyebrow'].find((item: { no: number }) => item.no === brows)
          const eyeItem = items['eyes'].find((item: { no: number }) => item.no === eye)
          const noseItem = items['nose'].find((item: { no: number }) => item.no === nose)
          const shirtItem = items['shirt'].find((item: { no: number }) => item.no === shirt)
          const pantItem = items['pants'].find((item: { no: number }) => item.no === pant)
          const shoeItem = items['shoes'].find((item: { no: number }) => item.no === shoe)
          const clothesItem = items['clothes'].find((item: { no: number }) => item.no === clothes)
          const accessoriesItem = items['accessories'].find(
            (item: { no: number }) => item.no === accessories
          )

          set((state) => ({
            avatarState: {
              ...state.avatarState,
              [currentGender]: {
                ...state.avatarState[currentGender],
                gender: gender,
                hair: hairItem,
                hat: hatItem,
                mouth: mouthItem,
                eyebrow: eyebrowItem,
                eyes: eyeItem,
                nose: noseItem,
                shirt: shirtItem,
                pants: pantItem,
                shoes: shoeItem,
                isOverall: isOverall,
                clothes: clothesItem,
                accessories: accessoriesItem,
                isHat: isHat,
                isAcc: isAcc,
              },
            },
          }))
        },
        setAvatarState: async (item) => {
          const currentCategory = useAvatarCategoryStore.getState().category
          const currentGender = useAvatarStore.getState().gender ? 'male' : 'female'
          try {
            if (currentCategory === 'shirt' || currentCategory === 'pants') {
              set((state) => ({
                avatarState: {
                  ...state.avatarState,
                  [currentGender]: {
                    ...state.avatarState[currentGender],
                    ['isOverall']: 0,
                  },
                },
              }))
            } else if (currentCategory === 'clothes') {
              set((state) => ({
                avatarState: {
                  ...state.avatarState,
                  [currentGender]: {
                    ...state.avatarState[currentGender],
                    ['isOverall']: 1,
                  },
                },
              }))
            } else if (currentCategory === 'accessories') {
              set((state) => ({
                avatarState: {
                  ...state.avatarState,
                  [currentGender]: {
                    ...state.avatarState[currentGender],
                    ['isAcc']: 1,
                  },
                },
              }))
            } else if (currentCategory === 'hat') {
              set((state) => ({
                avatarState: {
                  ...state.avatarState,
                  [currentGender]: {
                    ...state.avatarState[currentGender],
                    ['isHat']: 1,
                  },
                },
              }))
            }
            set((state) => ({
              avatarState: {
                ...state.avatarState,
                [currentGender]: {
                  ...state.avatarState[currentGender],
                  [currentCategory]: {
                    ...item,
                  },
                },
              },
            }))
          } catch (error) {
            console.error('Error changing avatar state:', error)
          }
        },
        // setPlayerBuild: async (item) => {
        //   const currentCategory = useAvatarCategoryStore.getState().category
        //   const currentGender = useAvatarStore.getState().gender ? 'male' : 'female'

        //   try {
        //     if (currentCategory === 'shirt' || currentCategory === 'pants') {
        //       set((state) => ({
        //         playerBuild: {
        //           ...state.playerBuild,
        //           [currentGender]: {
        //             ...state.playerBuild[currentGender],
        //             ['clothes']: { path: '' },
        //           },
        //         },
        //       }))
        //     }

        //     set((state) => {
        //       const updatedCategory = {
        //         ...state.playerBuild[currentGender][currentCategory],
        //         ...item,
        //       }

        //       return {
        //         playerBuild: {
        //           ...state.playerBuild,
        //           [currentGender]: {
        //             ...state.playerBuild[currentGender],
        //             [currentCategory]: updatedCategory,
        //           },
        //         },
        //       }
        //     })
        //   } catch (error) {
        //     console.error('Error changing player build:', error)
        //   }
        // },
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state,
          })
        },
      }),
      persistOptions
    )
  )
)
