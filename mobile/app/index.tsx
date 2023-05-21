import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/assets/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/16f3773b834d7dea0d3b',
}

export default function App() {
  const router = useRouter()

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '16f3773b834d7dea0d3b',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'timeline',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Your timeline
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Collect your jorney moments and share (if you want) with the world!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            REGISTER A MOMENT
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Made with love on the Rocketseat NLW
      </Text>
    </View>
  )
}

/* Test mobile IP
  console.log(makeRedirectUri({
    scheme: 'timeline',
  }),)
*/
