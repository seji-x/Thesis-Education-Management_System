import PageTitle from '@/components/common/PageTitle'

import TopBar from '../TopBar'
import ClassList from '../ClassList'

export default function Class() {
  return (
    <div>
      <PageTitle title="Class" />
      <div className="p-1 pt-3 pb-14">
        <TopBar />
        <ClassList />
      </div>
    </div>
  )
}
