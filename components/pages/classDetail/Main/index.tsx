'use client'

import Detail from '../Detail'
import ListStudent from '../ListStudent'
import { Tab, Tabs } from '@nextui-org/tabs'
import Subjects from '../Subjects'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Role } from '@/helper/enums'
import Score from '../Score'

export default function ClassDetail() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div>
      <Detail />
      <div className="mt-10">
        <Tabs size="lg" color="primary">
          <Tab key="student" title="STUDENT">
            <ListStudent />
          </Tab>
          {user?.role === Role.ADMIN ? (
            <Tab key="subject" title="SUBJECT">
              <Subjects />
            </Tab>
          ) : (
            <Tab key="score" title="SCORE">
              <Score />
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  )
}
