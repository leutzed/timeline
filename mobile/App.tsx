import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBG from './src/assets/bg-blur.png'
import Stripes from './src/assets/stripes.svg'
import NLWLogo from './src/assets/nlw-spacetime-logo.svg'

import { styled } from 'nativewind'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from './src/assets/lib/api'

const StyledStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/16f3773b834d7dea0d3b',
}

export default function App() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '16f3773b834d7dea0d3b',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'timeline',
      }),
    },
    discovery,
  )

  useEffect(() => {
    /* Test mobile IP
      console.log(makeRedirectUri({
        scheme: 'timeline',
      }),)
    */

    console.log(response)
    if (response?.type === 'success') {
      const { code } = response.params

      api
        .post('/register', {
          code,
        })
        .then((response) => {
          const { token } = response.data

          console.log(token)
        })
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurBG}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />

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

      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
