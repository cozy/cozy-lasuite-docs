import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { BarComponent, BarCenter } from 'cozy-bar'
import { Q, useQuery, generateWebLink, useClient } from 'cozy-client'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import Typography from 'cozy-ui/transpiled/react/Typography'

const AppLayout = () => {
  return (
    <>
      <BarComponent searchOptions={{ enabled: false }} />
      <Outlet />
    </>
  )
}

export default AppLayout
