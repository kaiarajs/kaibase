import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Kaiara } from '@kaiarajs/react-ui'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Kaiara>
     <Component {...pageProps} />
    </Kaiara>
  )
}
