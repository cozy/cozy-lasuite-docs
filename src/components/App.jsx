import React from 'react'

import { useExternalBridge } from 'cozy-external-bridge/container'
import flag from 'cozy-flags'

const App = () => {
  const embeddedDocsUrl = flag('docs.embedded-app-url')

  const { isReady, urlToLoad } = useExternalBridge(embeddedDocsUrl)

  return <iframe id="embeddedApp" src={isReady ? urlToLoad : null}></iframe>
}

export default App
