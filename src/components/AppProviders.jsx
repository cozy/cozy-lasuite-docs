import React from 'react'

import { BarProvider } from 'cozy-bar'
import { CozyProvider } from 'cozy-client'
import { RealTimeQueries } from 'cozy-client'
import { DataProxyProvider } from 'cozy-dataproxy-lib'
import { WebviewIntentProvider } from 'cozy-intent'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import SharingProvider from 'cozy-sharing'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AppProviders = ({ client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider>
      <CozyProvider client={client}>
        <RealTimeQueries doctype="io.cozy.files" />
        <DataProxyProvider>
          <AlertProvider>
            <SharingProvider doctype="io.cozy.files" documentType="Files">
              <BarProvider>
                <I18n lang={lang} polyglot={polyglot}>
                  <BreakpointsProvider>{children}</BreakpointsProvider>
                </I18n>
              </BarProvider>
            </SharingProvider>
          </AlertProvider>
        </DataProxyProvider>
      </CozyProvider>
    </WebviewIntentProvider>
  )
}

export default AppProviders
