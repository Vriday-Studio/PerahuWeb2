'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { database } from '@/app/firebase'
import { ref, get, remove, set } from 'firebase/database'
import { Container } from '@/components/Container'
import Button from '@/components/Button'
import Loading from '@/components/Loading'
import { useAuth } from '@/components/providers/AuthProvider'

interface Player {
  id: string
  name: string
  avatar: string
  boat: string
  jenisperahu: number
}

interface PlayerData {
  Name?: string
  name?: string
  Nama?: string
  avatar?: string
  boat?: string
  jenisperahu?: number
}

const BoatAdminPage = () => {
  const { user, isReady } = useAuth()
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set())
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [spawnLoading, setSpawnLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [maxPlayerInput, setMaxPlayerInput] = useState<string>('')
  const [maxPlayerLoading, setMaxPlayerLoading] = useState(false)

  const userId = useMemo(() => {
    const idValue = (user as any)?.id ?? (user as any)?.userID
    return typeof idValue === 'string' || typeof idValue === 'number' ? idValue : null
  }, [user])



  // Fetch players data
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        const snapshot = await get(ref(database, 'count/perahu/Player'))

        if (snapshot.exists()) {
          const data = snapshot.val()
          const playersList: Player[] = []

          for (const [key, value] of Object.entries(data)) {
            const playerData = value as PlayerData
            const playerName =
              typeof playerData.Nama === 'string'
                ? playerData.Nama
                : typeof playerData.name === 'string'
                  ? playerData.name
                  : typeof playerData.Name === 'string'
                    ? playerData.Name
                    : 'Unknown'

            playersList.push({
              id: key,
              name: playerName,
              avatar: playerData.avatar || '',
              boat: playerData.boat || '',
              jenisperahu: playerData.jenisperahu || 0,
            })
          }

          setPlayers(playersList)
        } else {
          setPlayers([])
        }
      } catch (error) {
        console.error('Error fetching players:', error)
        setMessage({ type: 'error', text: 'Gagal memuat data player' })
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  // Fetch max player default value
  useEffect(() => {
    const fetchMaxPlayer = async () => {
      try {
        const snapshot = await get(ref(database, 'count/perahu/maxPlayer'))
        if (snapshot.exists()) {
          const value = snapshot.val()
          if (typeof value === 'number') {
            setMaxPlayerInput(String(value))
          } else if (typeof value === 'string' && value.trim() !== '') {
            setMaxPlayerInput(value)
          }
        }
      } catch (error) {
        console.error('Error fetching maxPlayer:', error)
        setMessage({ type: 'error', text: 'Gagal memuat max player' })
      }
    }

    fetchMaxPlayer()
  }, [])

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(playerId)) {
        newSet.delete(playerId)
      } else {
        newSet.add(playerId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedPlayers.size === players.length) {
      setSelectedPlayers(new Set())
    } else {
      setSelectedPlayers(new Set(players.map((p) => p.id)))
    }
  }

  const handleDeletePlayers = async () => {
    if (selectedPlayers.size === 0) {
      setMessage({ type: 'error', text: 'Pilih minimal 1 player untuk dihapus' })
      return
    }

    const confirmed = window.confirm(`Hapus ${selectedPlayers.size} player? Tindakan ini tidak dapat dibatalkan.`)
    if (!confirmed) return

    try {
      setDeleteLoading(true)
      const deletePromises = Array.from(selectedPlayers).map((playerId) =>
        remove(ref(database, `count/perahu/Player/${playerId}`))
      )

      await Promise.all(deletePromises)

      setPlayers((prev) => prev.filter((p) => !selectedPlayers.has(p.id)))
      setSelectedPlayers(new Set())
      setMessage({ type: 'success', text: `${selectedPlayers.size} player berhasil dihapus` })
      router.refresh()

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error deleting players:', error)
      setMessage({ type: 'error', text: 'Gagal menghapus player' })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteSingle = async (playerId: string) => {
    const confirmed = window.confirm('Hapus player ini?')
    if (!confirmed) return

    try {
      setDeleteLoading(true)
      await remove(ref(database, `count/perahu/Player/${playerId}`))
      setPlayers((prev) => prev.filter((p) => p.id !== playerId))
      setSelectedPlayers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(playerId)
        return newSet
      })
      setMessage({ type: 'success', text: 'Player berhasil dihapus' })
      router.refresh()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error deleting player:', error)
      setMessage({ type: 'error', text: 'Gagal menghapus player' })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Generate random functions
  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const randomNames = [
    'Budi', 'Ahmad', 'Rini', 'Siti', 'Hendra', 'Maya', 'Andi', 'Ratna',
    'Bambang', 'Dewi', 'Fajar', 'Gita', 'Haris', 'Indah', 'Joko', 'Karina'
  ]

  const randomGreetings = [
    'Semoga makin banyak rejeki di tahun 2026. Amin!',
    'Semoga saya sekeluarga sehat sehat terus',
    'Pray for world peace',
    'Semangat buat IP 3.5',
    'Hope for bright and sunny day'
  ]

  const avatarOptions = [
    '1,15,0,0,1,10,0,1,0,0,0,0,7,0,1',
    '0,2,4,0,0,0,0,12,12,1,0,0,6,1,1'
  ]

  const handleSpawnRandomPlayer = async () => {
    try {
      setSpawnLoading(true)
      
      // Generate random data
      const randomId = generateRandomId()
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]
      const playerName = randomName
      const message = randomGreetings[Math.floor(Math.random() * randomGreetings.length)]
      const jenisperahu = Math.random() > 0.5 ? 1 : 2
      const avatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)]

      // Create player data
      const playerData = {
        Nama: playerName,
        name: playerName,
        message: message,
        avatar: avatar,
        jenisperahu: jenisperahu,
        boat: jenisperahu === 1 ? 'Perahu Putih' : 'Perahu Kuning',
      }

      // Save to Firebase
      await set(ref(database, `count/perahu/Player/${randomId}`), playerData)

      // Update local state
      setPlayers((prev) => [
        ...prev,
        {
          id: randomId,
          name: playerName,
          avatar: avatar,
          boat: jenisperahu === 1 ? 'Perahu Putih' : 'Perahu Kuning',
          jenisperahu: jenisperahu,
        }
      ])

      setMessage({ type: 'success', text: `Player ${playerName} berhasil di-spawn!` })
      router.refresh()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error spawning player:', error)
      setMessage({ type: 'error', text: 'Gagal spawn player' })
    } finally {
      setSpawnLoading(false)
    }
  }

  const handleResetSceneApp = async () => {
    try {
      await set(ref(database, 'count/perahu/command'), 'reset')
      setMessage({ type: 'success', text: 'Reset command terkirim' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error sending reset command:', error)
      setMessage({ type: 'error', text: 'Gagal mengirim reset command' })
    }
  }

  const handleResetAndClear = async () => {
    try {
      await set(ref(database, 'count/perahu/command'), 'resetclear')
      setMessage({ type: 'success', text: 'Reset & Clear command terkirim' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error sending resetclear command:', error)
      setMessage({ type: 'error', text: 'Gagal mengirim resetclear command' })
    }
  }

  const handleMaxPlayerChange = (value: string) => {
    if (value === '') {
      setMaxPlayerInput('')
      return
    }

    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      return
    }

    const clamped = Math.max(0, Math.min(100, Math.trunc(parsed)))
    setMaxPlayerInput(String(clamped))
  }

  const handleSaveMaxPlayer = async () => {
    if (maxPlayerInput === '') {
      setMessage({ type: 'error', text: 'Masukkan angka 0 - 100' })
      return
    }

    const parsed = Number(maxPlayerInput)
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      setMessage({ type: 'error', text: 'Masukkan angka 0 - 100' })
      return
    }

    try {
      setMaxPlayerLoading(true)
      await set(ref(database, 'count/perahu/maxPlayer'), Math.trunc(parsed))
      await set(ref(database, 'count/perahu/command'), 'reset')
      setMessage({ type: 'success', text: 'Max player berhasil disimpan' })
      router.refresh()
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving maxPlayer:', error)
      setMessage({ type: 'error', text: 'Gagal menyimpan max player' })
    } finally {
      setMaxPlayerLoading(false)
    }
  }

  if (!isReady || loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Event Perahu</h1>
            <p className="text-sm text-slate-300 mt-1">Total Player: <span className="font-semibold text-lg text-white">{players.length}</span></p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-slate-300">Spawn Dummy:</span>
            <Button
              onClick={handleSpawnRandomPlayer}
              disabled={spawnLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {spawnLoading ? 'Spawning...' : '+ Spawn Dummy'}
            </Button>
            <Button
              onClick={handleResetSceneApp}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Scene App
            </Button>
            <Button
              onClick={handleResetAndClear}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Reset dan Clear
            </Button>
            <div className="w-full mt-2">
              <label className="block text-sm text-slate-300 mb-2">Max Player (0 - 100)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={maxPlayerInput}
                  onChange={(event) => handleMaxPlayerChange(event.target.value)}
                  className="w-full sm:w-32 px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                />
                <Button
                  onClick={handleSaveMaxPlayer}
                  disabled={maxPlayerLoading}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {maxPlayerLoading ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-base font-medium ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                : 'bg-red-100 text-red-800 border-l-4 border-red-500'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Players List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table Header - Desktop Only */}
          <div className="hidden md:flex bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlayers.size === players.length && players.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </label>
            </div>
            <div className="flex-[2] font-semibold text-slate-900">ID</div>
            <div className="flex-[3] font-semibold text-slate-900">Nama</div>
            <div className="flex-[2.5] font-semibold text-slate-900">Avatar</div>
            <div className="flex-[2.5] font-semibold text-slate-900">Jenis Perahu</div>
            <div className="flex-1 text-right font-semibold text-slate-900">Aksi</div>
          </div>

          {/* Content */}
          {players.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500 text-lg">Tidak ada data player</p>
            </div>
          ) : (
            <>
              {/* Mobile & Tablet View */}
              <div className="md:hidden space-y-3 p-4 sm:p-6">
                {/* Select All Mobile */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={selectedPlayers.size === players.length && players.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700">Pilih Semua</span>
                  </label>
                  {selectedPlayers.size > 0 && (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {selectedPlayers.size}
                    </span>
                  )}
                </div>

                {/* Player Cards */}
                {players.map((player) => (
                  <div key={player.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.has(player.id)}
                        onChange={() => handleSelectPlayer(player.id)}
                        className="w-5 h-5 rounded cursor-pointer mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-slate-900 truncate">{player.name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-1 break-all">{player.id}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div>
                        <span className="text-slate-600 font-medium">Avatar:</span>
                        <p className="text-slate-700 break-words text-xs">{player.avatar || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium">Jenis Perahu:</span>
                        <p className="text-slate-700">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                            player.jenisperahu === 1 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {player.jenisperahu === 1 ? 'Perahu Putih' : 'Perahu Kuning'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSingle(player.id)}
                      disabled={deleteLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-3 text-base rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-100">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPlayers.has(player.id)}
                            onChange={() => handleSelectPlayer(player.id)}
                            className="w-5 h-5 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">{player.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">{player.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{player.avatar || '—'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            player.jenisperahu === 1 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {player.jenisperahu === 1 ? 'Perahu Putih' : 'Perahu Kuning'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteSingle(player.id)}
                            disabled={deleteLoading}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 text-base rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Batch Delete Button - Mobile */}
          {selectedPlayers.size > 0 && (
            <div className="md:hidden px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <Button
                onClick={() => setSelectedPlayers(new Set())}
                className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-semibold px-4 py-3 text-base rounded-lg"
              >
                Batal
              </Button>
              <Button
                onClick={handleDeletePlayers}
                disabled={deleteLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-3 text-base rounded-lg"
              >
                {deleteLoading ? 'Menghapus...' : `Hapus (${selectedPlayers.size})`}
              </Button>
            </div>
          )}

          {/* Batch Delete Button - Desktop */}
          {selectedPlayers.size > 0 && (
            <div className="hidden md:flex px-6 py-4 bg-slate-50 border-t border-slate-200 gap-3 justify-end">
              <Button
                onClick={() => setSelectedPlayers(new Set())}
                className="bg-slate-400 hover:bg-slate-500 text-white font-semibold px-6 py-3 text-base rounded-lg"
              >
                Batal
              </Button>
              <Button
                onClick={handleDeletePlayers}
                disabled={deleteLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 text-base rounded-lg"
              >
                {deleteLoading ? 'Menghapus...' : `Hapus Terpilih (${selectedPlayers.size})`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default BoatAdminPage
