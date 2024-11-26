import PageTitle from '@/components/common/PageTitle'

import TopBar from '../TopBar'
import SubjectList from '../SubjectList'

export default function Subject() {
  return (
    <div>
      <PageTitle title="Subject" />
      <div className="p-1 pt-3 pb-14">
        <TopBar />
        <SubjectList />
      </div>
    </div>
  )
}
