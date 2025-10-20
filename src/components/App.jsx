import React, { useState, useEffect, useCallback } from 'react'

import { useExternalBridge } from 'cozy-external-bridge/container'
import flag from 'cozy-flags'

import styles from '../styles/iframes.styl'

import { useLocation } from 'react-router-dom'
import { Q, useClient, useQuery } from 'cozy-client'
import { BarRight } from 'cozy-bar'

import SharingProvider, { ShareModal } from 'cozy-sharing'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import Dialog, { DialogTitle, DialogActions } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Typography from 'cozy-ui/transpiled/react/Typography'

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

  const isHTTPS = window.location.protocol === 'https:'
  const driveURL = `http${isHTTPS ? 's' : ''}://drive.${client.instanceOptions.domain}`;

  const [controllerAppUrl, setControllerAppUrl] = useState(driveURL)

  const [controllerHasLoaded, setControllerHasLoaded] = useState(false)

  const controllerApp = React.useRef(null)
  const embeddedApp = React.useRef(null)

  const updateOpenedFileInController = useCallback(() => {
    if (!currentlyOpenedFile) return
    const directory = currentlyOpenedFile.dir_id
    controllerApp.current.contentWindow.postMessage('openFolder:' + directory, '*');
    controllerApp.current.contentWindow.postMessage('selectedFile:' + currentlyOpenedFile.id, '*');
  }, [currentlyOpenedFile])

  useEffect(() => {
    updateOpenedFileInController();
  }, [currentlyOpenedFile, controllerHasLoaded])

  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    window.onmessage = function (e) {
      if (e.data == undefined || e.data == null || typeof e.data !== "string") return;
      if( e.data === "loaded") {
        console.log("embedded app loaded")
        if (!controllerHasLoaded) {
          setControllerHasLoaded(true);
        }
        controllerApp.current.contentWindow.postMessage('inShell:true', '*');
        updateOpenedFileInController();
      }
      if (e.data.startsWith("openFile:")) {
        const fileId = e.data.split("openFile:")[1].trim();
        console.log("should open ", fileId)
        // redirect to same url but replace everything after docs/* by docs/{fileId}
        const newURL = embeddedDocsUrl + "/docs/" + fileId;
        console.log("newURL", newURL)
        // embeddedApp.current.src = newURL;
        embeddedApp.current.contentWindow.postMessage('openFile:' + fileId, '*');
      }
      if (e.data === ("shareFile")) {
        console.log("should share current file")
        setShareModalOpen(true);
      }
    };
  }, [])

  const createNewDocument = () => {
    if (!embeddedApp.current) return;
    embeddedApp.current.contentWindow.postMessage('newDoc', '*');
  }

  return (
    <div className={styles["iframesContainer"]}>
      <BarRight>
        <Button
          label={"Nouveau document"}
          variant={"primary"}
          size="small"
          startIcon={<Icon icon={PlusIcon} />}
          onClick={() => createNewDocument()}
          className={"u-mr-1"}
        />
      </BarRight>

      {shareModalOpen && currentlyOpenedFile && (
        <ShareModal
          document={currentlyOpenedFile}
          documentType="Files"
          sharingDesc={currentlyOpenedFile.name}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      <iframe ref={controllerApp} className={styles["controllerApp"]} id="controllerApp" src={controllerAppUrl}></iframe>
      <iframe ref={embeddedApp} className={styles["embeddedApp"]} id="embeddedApp" src={isReady ? urlToLoad : null}></iframe>
    </div>
  )
}

export default App
