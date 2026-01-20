import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type TEvent = 'treasure_hunt' | 'quiz' | 'racing' | 'none'
type TreasureHuntGameStatus = 'none' | 'wait' | 'ingame' | 'finish'

export default function redirectByEventType(
  router: AppRouterInstance,
  eventType: TEvent,
  _isInEvent: boolean,
  _treasureHuntStatus: TreasureHuntGameStatus
) {
  if (_isInEvent) {
    if (eventType === 'quiz') {
      router.push('/intro/quiz')
    }
    if (eventType === 'treasure_hunt' && _treasureHuntStatus !== 'ingame') {
      router.push('/intro/treasure-hunt')
    }
    if (eventType === 'racing') {
      router.push('/intro/racing')
    }
  } else {
    router.push('/')
  }
}
