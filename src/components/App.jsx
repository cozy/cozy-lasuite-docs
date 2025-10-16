import React, { useState, useEffect } from 'react'

import { useExternalBridge } from 'cozy-external-bridge/container'
import flag from 'cozy-flags'

import styles from '../styles/iframes.styl'

import { useLocation } from 'react-router-dom'
import { Q, useClient, useQuery } from 'cozy-client'

const App = () => {
  const { pathname } = useLocation()
  const client = useClient()

  const externalId = pathname.includes('/bridge/docs/')
    ? pathname.replace('/bridge/docs/', '').replace('/', '')
    : null

  const { data: files } = useQuery(
    Q('io.cozy.files')
      .where({ 'metadata.externalId': externalId })
      .indexFields(['metadata.externalId'])
      .limitBy(1),
    { as: `io.cozy.files/${externalId}` }
  )

  const currentlyOpenedFile = files && files.length > 0 ? files[0] : null
  console.log("currentlyOpenedFile", currentlyOpenedFile)

  const embeddedDocsUrl = flag('docs.embedded-app-url')

  const { isReady, urlToLoad } = useExternalBridge(embeddedDocsUrl)
  const [controllerAppUrl, setControllerAppUrl] = useState("http://drive.claude2.192-168-1-28.nip.io:8080/")
  const [controllerAppParams, setControllerAppParams] = useState(["runsInShell=true"])

  const addOrReplaceParam = (key, value) => {
    const index = controllerAppParams.findIndex(param => param.startsWith(key + "="))
    if (index !== -1) {
      const newParams = [...controllerAppParams]
      newParams[index] = `${key}=${value}`
      setControllerAppParams(newParams)
    } else {
      setControllerAppParams([...controllerAppParams, `${key}=${value}`])
    }
  }

  const removeItemFromParams = (key) => {
    const newParams = controllerAppParams.filter(param => !param.startsWith(key + "="))
    setControllerAppParams(newParams)
  }

  useEffect(() => {
    if (!currentlyOpenedFile) return
    const directory = currentlyOpenedFile.dir_id
    setControllerAppUrl(`http://drive.claude2.192-168-1-28.nip.io:8080/#/folder/${directory}`)
    addOrReplaceParam("selectedFile", currentlyOpenedFile.id)
  }, [currentlyOpenedFile])

  return (
    <div className={styles["iframesContainer"]}>
      <iframe className={styles["controllerApp"]} id="controllerApp" src={
        controllerAppUrl + (controllerAppParams.length > 0 ? "?" + controllerAppParams.join("&") : "")
      }></iframe>
      <iframe className={styles["embeddedApp"]} id="embeddedApp" src={isReady ? urlToLoad : null}></iframe>
    </div>
  )
}

export default App
