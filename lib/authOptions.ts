import type { Account, NextAuthOptions, Profile, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import InstagramProvider from 'next-auth/providers/instagram'
import CredentialsProvider from 'next-auth/providers/credentials'
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth, database } from '@/app/firebase'
import { AdapterUser } from 'next-auth/adapters'
import { getUserIdByEmailNoSesssion } from '@/utils/getUserIdByEmail'
import { ref, get, set, update } from 'firebase/database'

const createUser = async (user: any, account: any) => {
  const snapshot = await get(ref(database, 'isPlayerCount'))
  if (snapshot.exists()) {
    let count = parseInt(snapshot.val())
    const createUserRef = ref(database, 'Users/' + count)
    const userSnapshot = await get(createUserRef)
    if (userSnapshot.exists()) {
      // account id no. exists
    } else {
      const userID = await getUserIdByEmailNoSesssion(user.email)
      const userRef = ref(database, `Users/` + userID)
      const userSnapshot = await get(userRef)
      if (!userSnapshot.exists()) {
        const email: string =
          user.email === null || user.email === undefined
            ? `${user.name}@${account.provider}.com`
            : user.email

        await set(createUserRef, {
          Nama: user.name,
          Hp: '',
          Interest: '',
          Kota: '',
          Provinsi: '',
          Gender: 'male',
          Email: email,
          Username: user.name,
          Tanggal_Lahir: '',
          ismove: 'LogOn',
          moveX: 0,
          moveY: 0,
          avatar: '1, 13, 0, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0',
          message: 'emoji_1',
          isMessage: 'false',
          npcMessage: 'false_Dadaah!_Pemusik',
          subsEmail: '',
        })

        const newPlayerCount = count + 1
        await update(ref(database, '/'), {
          isPlayerCount: newPlayerCount.toString(),
        })
      }
    }
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: '/sign-in',
    error: '/sign-up',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      // authorization: 'https://api.instagram.com/oauth/authorize',
      // client: {
      //   token_endpoint_auth_method: 'client_secret_post',
      // },
    }),
    CredentialsProvider({
      id: 'user-register',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await createUserWithEmailAndPassword(
          auth,
          (credentials as any).email || '',
          (credentials as any).password || ''
        )
          .then((userCredential) => {
            if (userCredential.user) {
              return {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                isAnonymous: userCredential.user.isAnonymous,
              }
            }
            return null
          })
          .catch((error) => {
            throw new Error(JSON.stringify({ errors: error, status: false }))
          })
      },
    }),
    CredentialsProvider({
      id: 'user-login',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || '',
          (credentials as any).password || ''
        )
          .then((userCredential) => {
            if (userCredential.user) {
              return {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                isAnonymous: userCredential.user.isAnonymous,
              }
            }
            return null
          })
          .catch((error) => {
            throw new Error(JSON.stringify({ errors: error, status: false }))
          })
      },
    }),
    CredentialsProvider({
      id: 'guest-login',
      name: 'Guest',
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInAnonymously(auth)
          .then((userCredential) => {
            if (userCredential.user) {
              return {
                id: userCredential.user.uid,
                email: (credentials as any).email,
                isAnonymous: userCredential.user.isAnonymous,
              }
            }
            return null
          })
          .catch((error) => {
            throw new Error(JSON.stringify({ errors: error, status: false }))
          })
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User | AdapterUser | any
      account: Account | null
      profile?: Profile | any
    }) {
      if (account?.provider === 'google') {
        await signInWithCredential(
          auth,
          GoogleAuthProvider.credential(account.id_token, account.access_token)
        )
        await createUser(user, account)
        return Promise.resolve(true)
      } else if (account?.provider === 'instagram') {
        await createUserWithEmailAndPassword(auth, `${user.name}@instagram.com`, '12345678!@#$%')
          .then(async (res) => {
            const snapshot = await get(ref(database, 'isPlayerCount'))
            if (snapshot.exists()) {
              let count = parseInt(snapshot.val())

              const createUserRef = ref(database, 'Users/' + count)
              const userSnapshot = await get(createUserRef)
              if (userSnapshot.exists()) {
                // account id no. exists
              } else {
                const userID = await getUserIdByEmailNoSesssion(res.user.email)
                const userRef = ref(database, `Users/` + userID)
                const userSnapshot = await get(userRef)
                if (!userSnapshot.exists()) {
                  await set(createUserRef, {
                    Nama: user.name,
                    Hp: '',
                    Interest: '',
                    Kota: '',
                    Provinsi: '',
                    Gender: 'male',
                    Email: res.user.email,
                    Username: user.name,
                    Tanggal_Lahir: '',
                    ismove: 'LogOn',
                    moveX: 0,
                    moveY: 0,
                    avatar: '1, 13, 0, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                    message: 'emoji_1',
                    isMessage: 'false',
                    npcMessage: 'false_Dadaah!_Pemusik',
                    subsEmail: '',
                  })

                  const newPlayerCount = count + 1
                  await update(ref(database, '/'), {
                    isPlayerCount: newPlayerCount.toString(),
                  })
                }
              }
            }
          })
          .catch(async (error) => {
            if (error.code === 'auth/email-already-in-use') {
              await signInWithCredential(
                auth,
                EmailAuthProvider.credential(`${user.name}@instagram.com`, '12345678!@#$%')
              )
            }
          })
        return Promise.resolve(true)
      } else {
        return true
      }
    },

    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ user, token, account }: any) {
      if (user) {
        token.id = user.id
        token.email = user.email || `${user.name}@${account.provider}.com`
        token.isAnonymous = user.isAnonymous || false
      }

      return token
    },
    async session({ session, token }: any) {
      session.user.id = token.id
      session.user.email = token.email
      session.user.isAnonymous = token.isAnonymous || false
      return session
    },
  },
}
