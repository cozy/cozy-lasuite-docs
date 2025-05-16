import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent, BarCenter } from 'cozy-bar'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'

const AppLayout = () => {
  return (
    <>
      <BarCenter>
        <BarTitle>Docs</BarTitle>
      </BarCenter>
      <BarComponent searchOptions={{ enabled: false }} />
      <Outlet />
    </>
  )
}

export default AppLayout
