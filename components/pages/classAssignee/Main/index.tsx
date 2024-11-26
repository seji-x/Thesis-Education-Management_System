'use client'

import PageTitle from '@/components/common/PageTitle'
import Detail from '../../classDetail/Detail'
import ListStudent from '../../classDetail/ListStudent'

export default function ClassAssignee() {
  return (
    <div>
      <PageTitle title="Class" />
      <Detail />
      <ListStudent />
    </div>
  )
}
