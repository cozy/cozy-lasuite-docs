import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { BarLeft, BarCenter, BarRight } from 'cozy-bar'
import { Q, useQuery } from 'cozy-client'
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
  // Hooks
  const { pathname } = useLocation()
  const { isMobile } = useBreakpoints()

  // Config
  const driveEnabled = flag('docs.drive.enabled')

  // State
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [driveOpen, setDriveOpen] = useState(false)
  const [controllerHasLoaded, setControllerHasLoaded] = useState(false)
  const [embeddedAppHasLoaded, setEmbeddedAppHasLoaded] = useState(false)

  // Refs
  const controllerApp = React.useRef(null)
  const embeddedApp = React.useRef(null)

  // Data
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

  // URLs
  const embeddedDocsUrl = flag('docs.embedded-app-url')
  const { isReady, urlToLoad } = useExternalBridge(embeddedDocsUrl)

  const controllerAppUrl = window.location.origin.replace('docs', 'drive')

  // Helpers
  // Get path without filename and sanitize it
  const path = currentlyOpenedFile
    ? currentlyOpenedFile.path.replace(currentlyOpenedFile.name, '')
    : ''
  const sanitizedPath = path.endsWith('/') ? path.slice(0, -1) : path

  // Callbacks
  // Ask controller to open folder and select file (changes shell state)
  const updateOpenedFileInController = useCallback(() => {
    if (!controllerHasLoaded) return
    if (!driveEnabled) return
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
  }, [currentlyOpenedFile, controllerHasLoaded, driveEnabled])

  // Ask embedded app to create a new document
  const createNewDocument = () => {
    if (!embeddedApp.current) return
    embeddedApp.current.contentWindow.postMessage('newDoc', '*')
  }

  // Effects
  // Update controller folder when opened file changes
  useEffect(() => {
    if (!controllerHasLoaded) return
    if (!driveEnabled) return
    updateOpenedFileInController()
  }, [
    currentlyOpenedFile,
    controllerHasLoaded,
    updateOpenedFileInController,
    driveEnabled
  ])

  // Message listener
  useEffect(() => {
    window.onmessage = function (e) {
      if (e.data == undefined || e.data == null || typeof e.data !== 'string')
        return

      // CONTROLLER : Has loaded
      if (e.data === 'loaded') {
        if (!controllerHasLoaded) {
          setControllerHasLoaded(true)
        }
        if (!controllerApp.current) return
        controllerApp.current.contentWindow.postMessage('inShell:true', '*')
        updateOpenedFileInController()
      }

      // EMBEDDED : Has loaded
      if (e.data === 'embedded') {
        setEmbeddedAppHasLoaded(true)
      }

      // CONTROLLER : Open file request
      if (e.data.startsWith('openFile:')) {
        const fileId = e.data.split('openFile:')[1].trim()
        embeddedApp.current.contentWindow.postMessage('openFile:' + fileId, '*')
      }

      // EMBEDDED : Share file request
      if (e.data === 'shareFile') {
        setShareModalOpen(true)
      }
    }
  }, [controllerHasLoaded, updateOpenedFileInController])

  return (
    <div
      className={`${styles['iframesContainer']} ${styles['iframesContainer--' + (isMobile ? 'mobile' : 'desktop')]}`}
    >
      {driveEnabled && (
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
      )}

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

      {driveEnabled && embeddedAppHasLoaded && (
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
