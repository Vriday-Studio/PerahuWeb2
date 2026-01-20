import { getUserIdByEmail } from '@/utils/getUserIdByEmail'
import { database } from '@/app/firebase'
import { ref, get } from 'firebase/database'
import { create } from 'zustand'
import { useAvatarStore } from './avatar'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'

type TParams = {
  isInitialized: boolean
  setIsInitialized: (value: boolean) => void
  userData: {
    Email: string
    Name: string
    Avatar: number[]
    userID: number | null
    Gender: string
    DateOfBirth: string
    PhoneNo: string
  }
  setUserData: any
  resetUserData: () => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
const DEFAULT_AVATAR_MALE = '1,13,0,0,1,10,0,0,0,0,0,0,0,0,0'
const DEFAULT_AVATAR_FEMALE = '0,0,0,0,0,10,0,12,12,12,0,0,0,0,0'

const parseAvatar = (avatarValue: string | number[] | undefined, gender: string) => {
  if (Array.isArray(avatarValue)) return avatarValue
  if (typeof avatarValue === 'string' && avatarValue.length > 0) {
    return avatarValue.split(',').map((value) => Number(value))
  }
  const fallback = gender === 'female' ? DEFAULT_AVATAR_FEMALE : DEFAULT_AVATAR_MALE
  return fallback.split(',').map((value) => Number(value))
}
const persistOptions: PersistOptions<TParams, any> = {
  name: 'user-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ ...state }),
  onRehydrateStorage: () => (state) => {
    state?.setHasHydrated(true)
  },
}

export const useUserStore = create(
  persist<TParams>(
    (set) => ({
      isInitialized: false,
      setIsInitialized: (value) => {
        set({ isInitialized: value })
      },
      userData: {
        Email: '',
        Name: '',
        Avatar: [],
        userID: 0,
        Gender: '',
        DateOfBirth: '',
        PhoneNo: '',
      },
      setUserData: async (sessionData: any) => {
        try {
          const userID = await getUserIdByEmail(sessionData)

          if (userID === null) return

          const dbRef = ref(database, 'Users/' + userID)
          const snapshot = await get(dbRef)
          if (snapshot.exists()) {
            const { Email, Nama, avatar, Gender, Hp, Tanggal_Lahir } = snapshot.val()
            const avatarInArray = parseAvatar(avatar, Gender)
            set({
              userData: {
                Email: Email,
                Name: Nama,
                Avatar: avatarInArray,
                userID: parseInt(userID!, 10),
                Gender: Gender,
                DateOfBirth: Tanggal_Lahir,
                PhoneNo: Hp,
              },
            })
            // console.log(snapshot.val())

            useAvatarStore.getState().initializeCurrentAvatarState(avatarInArray)
            useAvatarStore.getState().initializeAvatarState()
          } else {
            console.log(userID)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      },
      resetUserData: () => {
        set({
          userData: {
            Email: '',
            Name: '',
            Avatar: [],
            userID: 0,
            Gender: '',
            DateOfBirth: '',
            PhoneNo: '',
          },
        })
        set({ isInitialized: false })
      },
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
