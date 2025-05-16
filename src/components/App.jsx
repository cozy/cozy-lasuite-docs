import React from 'react'

import { useExternalBridge } from 'cozy-external-bridge/container'
import flag from 'cozy-flags'

const App = () => {
  const embeddedDocsUrl = flag('docs.embedded-app-url')

  useExternalBridge(embeddedDocsUrl)

  return <iframe id="embeddedApp" src={embeddedDocsUrl}></iframe>
}

export default App
