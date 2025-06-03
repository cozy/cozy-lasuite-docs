import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { BarComponent, BarCenter } from 'cozy-bar'
import { Q, useQuery, generateWebLink, useClient } from 'cozy-client'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import Typography from 'cozy-ui/transpiled/react/Typography'

const makeParentFolderPath = file => {
  if (!file.path) return ''

  return file.dir_id === 'io.cozy.files.root-dir'
    ? file.path.replace(file.name, '')
    : file.path.replace(`/${file.name}`, '')
}

const useTitle = () => {
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

  if (!files || files.length < 1) return { title: 'Docs' }

  const file = files[0]

  const path = makeParentFolderPath(file)

  const link = generateWebLink({
    slug: 'drive',
    cozyUrl: client.getStackClient().uri,
    subDomainType: client?.getInstanceOptions().subdomain,
    pathname: '/',
    hash: `folder/${file.dir_id}`
  })

  return { title: file.name, path, link }
}

const AppLayout = () => {
  const { title, path, link } = useTitle()

  return (
    <>
      <BarCenter>
        {path ? (
          <div className="u-flex u-flex-column">
            <Typography variant="h6">{title}</Typography>
            <a href={link} target="_blank" rel="noreferrer">
              <Typography variant="caption">{path}</Typography>
            </a>
          </div>
        ) : (
          <BarTitle>{title}</BarTitle>
        )}
      </BarCenter>
      <BarComponent searchOptions={{ enabled: false }} />
      <Outlet />
    </>
  )
}

export default AppLayout
