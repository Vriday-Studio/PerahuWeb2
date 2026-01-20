import { create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'

type TEvent = 'treasure_hunt' | 'quiz' | 'racing' | 'none'
type TreasureHuntGameStatus = 'none' | 'wait' | 'ingame' | 'finish'

type TParams = {
  eventType: TEvent
  setEventType: (value: TEvent) => void
  _isInEvent: boolean
  setEvent: (value: boolean) => void
  _isNpcTalk: boolean
  setNpcTalk: (value: boolean) => void
  _isTimeWait: boolean
  setTimeWait: (value: boolean) => void
  _treasureHuntStatus: TreasureHuntGameStatus
  setTreasureHuntStatus: (value: TreasureHuntGameStatus) => void
  resetGameStore: () => void
  startGame: boolean
  setStartGame: (value: boolean) => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
const persistOptions: PersistOptions<TParams, any> = {
  name: 'game-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ ...state }),
  onRehydrateStorage: () => (state) => {
    state?.setHasHydrated(true)
  },
}

export const useGameStore = create(
  persist<TParams>(
    (set) => ({
      eventType: 'none',
      _isInEvent: false,
      _isNpcTalk: false,
      _isTimeWait: false,
      _treasureHuntStatus: 'none',
      startGame: false,
      setStartGame: (value: boolean) => {
        set({ startGame: value })
      },
      setTreasureHuntStatus: (value: TreasureHuntGameStatus) => {
        set({ _treasureHuntStatus: value })
      },
      setEventType: (value: TEvent) => {
        if (value === 'none') {
          set({ _isInEvent: false, eventType: value })
        } else {
          set({ _isInEvent: true, eventType: value })
        }
      },
      setEvent: (value) => {
        set({ _isInEvent: value })
      },
      setNpcTalk: (value) => {
        set({ _isNpcTalk: value })
      },
      setTimeWait: (value) => {
        set({ _isTimeWait: value })
      },
      resetGameStore: () => {
        set({
          _isInEvent: false,
          _isNpcTalk: false,
          _isTimeWait: false,
          eventType: 'none',
          _treasureHuntStatus: 'none',
          startGame: false,
        })
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
