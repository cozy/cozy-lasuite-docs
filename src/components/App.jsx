import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { BarLeft, BarCenter, BarRight } from 'cozy-bar'
import { Q, useClient, useQuery } from 'cozy-client'
import { useExternalBridge } from 'cozy-external-bridge/container'
import flag from 'cozy-flags'
import { ShareModal } from 'cozy-sharing'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BurgerIcon from 'cozy-ui/transpiled/react/Icons/Burger'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import { CircularProgress } from 'cozy-ui/transpiled/react/Progress'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import styles from '../styles/iframes.styl'

const App = () => {
  const { pathname } = useLocation()
  const client = useClient()
  const { isMobile } = useBreakpoints()

  // State to manage share modal visibility
  const [shareModalOpen, setShareModalOpen] = useState(false)

  // State to manage drive panel visibility (desktop / mobile)
  const [driveOpen, setDriveOpen] = useState(false)

  // Getting the currently opened file based on the URL
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

  // State containing the currently opened file
  const currentlyOpenedFile = files && files.length > 0 ? files[0] : null

  // Get IFrame URL from external flag
  const embeddedDocsUrl = flag('docs.embedded-app-url')
  const { isReady, urlToLoad } = useExternalBridge(embeddedDocsUrl)

  // Getting drive controller URL
  const isHTTPS = window.location.protocol === 'https:'
  const driveURL = `http${isHTTPS ? 's' : ''}://drive.${client.instanceOptions.domain}`
  const controllerAppUrl = driveURL
  const [controllerHasLoaded, setControllerHasLoaded] = useState(false)
  const [embeddedAppHasLoaded, setEmbeddedAppHasLoaded] = useState(false)

  // Réfs to interact with iframes
  const controllerApp = React.useRef(null)
  const embeddedApp = React.useRef(null)

  // Synchronize opened file with controller app (opens in the right folder)
  const updateOpenedFileInController = useCallback(() => {
    if (!currentlyOpenedFile) return
    if (!controllerApp.current) return
    const directory = currentlyOpenedFile.dir_id
    controllerApp.current.contentWindow.postMessage(
      'openFolder:' + directory,
      '*'
    )
    controllerApp.current.contentWindow.postMessage(
      'selectedFile:' + currentlyOpenedFile.id,
      '*'
    )
  }, [currentlyOpenedFile])

  // Call synchronization when loaded and on file change (if link opened from Iframe)
  useEffect(() => {
    updateOpenedFileInController()
  }, [currentlyOpenedFile, controllerHasLoaded, updateOpenedFileInController])

  // Intercept messages from both iframes
  useEffect(() => {
    window.onmessage = function (e) {
      if (e.data == undefined || e.data == null || typeof e.data !== 'string')
        return
      // CONTROLLER : Has loaded
      if (e.data === 'loaded') {
        // Save loaded state
        if (!controllerHasLoaded) {
          setControllerHasLoaded(true)
        }
        // Inform controller that we are in shell (to enable shell specific features)
        if (!controllerApp.current) return
        controllerApp.current.contentWindow.postMessage('inShell:true', '*')
        // Sync opened file in controller
        updateOpenedFileInController()
      }

      // EMBEDDED : Has loaded
      if (e.data === 'embedded') {
        setEmbeddedAppHasLoaded(true)
      }

      // CONTROLLER : Open file request
      if (e.data.startsWith('openFile:')) {
        // Get fileId
        const fileId = e.data.split('openFile:')[1].trim()
        // Ask EMBEDDED app to open the file in its router
        embeddedApp.current.contentWindow.postMessage('openFile:' + fileId, '*')
      }

      // EMBEDDED : Share file request
      if (e.data === 'shareFile') {
        // Open share modal (knows file from currentlyOpenedFile state)
        setShareModalOpen(true)
      }
    }
  }, [controllerHasLoaded, updateOpenedFileInController])

  // Function to create a new document from the CONTROLLER app
  const createNewDocument = () => {
    if (!embeddedApp.current) return
    // Ask EMBEDDED app to create a new document
    embeddedApp.current.contentWindow.postMessage('newDoc', '*')
  }

  // Sanitize path for display
  const path = currentlyOpenedFile
    ? currentlyOpenedFile.path.replace(currentlyOpenedFile.name, '')
    : ''
  const sanitizedPath = path.endsWith('/') ? path.slice(0, -1) : path

  return (
    <div
      className={`${styles['iframesContainer']} ${styles['iframesContainer--' + (isMobile ? 'mobile' : 'desktop')]}`}
    >
      <BarLeft>
        <Button
          label={
            !controllerHasLoaded ? (
              <CircularProgress size={20} />
            ) : (
              <Icon
                icon={BurgerIcon}
                size={20}
                color="var(--primaryTextColor)"
              />
            )
          }
          variant="text"
          color="inherit"
          size="large"
          onClick={() => setDriveOpen(!driveOpen)}
          style={{
            padding: 0,
            width: 42,
            height: 42,
            margin: '0 8px',
            marginLeft: !isMobile ? -8 : 4
          }}
          disabled={!controllerHasLoaded}
        />
      </BarLeft>

      {currentlyOpenedFile ? (
        <BarCenter>
          {currentlyOpenedFile.path ? (
            <a
              style={{
                color: 'inherit',
                textDecoration: 'none',
                marginLeft: 4
              }}
              onClick={e => {
                e.preventDefault()
                // Ask CONTROLLER app to open the parent folder
                if (!controllerApp.current) return
                controllerApp.current.contentWindow.postMessage(
                  'openFolder:' + currentlyOpenedFile.dir_id,
                  '*'
                )
              }}
              href="#"
              className="u-flex u-flex-column"
            >
              <Typography variant="subtitle2">
                {currentlyOpenedFile.name}
              </Typography>
              {sanitizedPath && sanitizedPath !== '/' ? (
                <Typography variant="caption">{sanitizedPath}</Typography>
              ) : (
                <></>
              )}
            </a>
          ) : (
            <></>
          )}
        </BarCenter>
      ) : (
        <BarCenter>
          <BarTitle>Docs</BarTitle>
        </BarCenter>
      )}

      {!isMobile && (
        <BarRight>
          <Button
            label="Nouveau document"
            variant="primary"
            size="small"
            startIcon={<Icon icon={PlusIcon} />}
            onClick={() => createNewDocument()}
            className="u-mr-1"
          />
        </BarRight>
      )}

      {shareModalOpen && currentlyOpenedFile && (
        <ShareModal
          document={currentlyOpenedFile}
          documentType="Files"
          sharingDesc={currentlyOpenedFile.name}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      {embeddedAppHasLoaded && (
        <iframe
          ref={controllerApp}
          className={`${styles['controllerApp']} ${styles['controllerApp--' + (isMobile ? 'mobile' : 'desktop')]} ${driveOpen ? styles['open'] : ''}`}
          id="controllerApp"
          src={controllerAppUrl}
        ></iframe>
      )}

      <iframe
        ref={embeddedApp}
        className={`${styles['embeddedApp']} ${styles['embeddedApp--' + (isMobile ? 'mobile' : 'desktop')]}`}
        id="embeddedApp"
        src={isReady ? urlToLoad : null}
      ></iframe>
    </div>
  )
}

export default App
