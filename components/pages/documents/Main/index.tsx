'use client'

import PageTitle from '@/components/common/PageTitle'
import TopBar from '../TopBar'
import DocumentList from '../DocumentList'

export default function Documents() {
  return (
    <div>
      <PageTitle title="Documents" />
      <TopBar />
      <DocumentList />
    </div>
  )
}
