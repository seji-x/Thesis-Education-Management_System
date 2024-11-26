import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { exams } from '@/config/constants'
import { IUserSubjectScore } from '@/types'

interface Props {
  subjectScores: IUserSubjectScore[]
}

const tableCols: { key: string; label: string; width?: string }[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'subject',
    label: 'Subject',
  },
  {
    key: 'score',
    label: 'Score',
    width: '60%',
  },
  {
    key: 'status',
    label: 'Status',
  },
]

export default function ScoreTable({ subjectScores }: Props) {
  return (
    <Table>
      <TableHeader columns={tableCols}>
        {(col) => (
          <TableColumn
            key={col.key}
            style={{
              width: col.width,
            }}
            align="center"
          >
            {col.label}
            {col.key === 'score' && (
              <div className="grid grid-cols-8">
                {exams.map((exam) => (
                  <div key={exam} className="border-l py-1">
                    {exam}
                  </div>
                ))}
                <div key="CONCLUTION" className="border-l py-1">
                  CONCLUTION
                </div>
              </div>
            )}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {subjectScores.map((subjectScore, index) => (
          <TableRow key={subjectScore.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{subjectScore.subject.name}</TableCell>
            <TableCell>
              <div className="grid grid-cols-8">
                {exams.map((exam) => (
                  <div key={exam} className="border h-8 flex items-center justify-center">
                    {subjectScore.score[exam]}
                  </div>
                ))}
                <div key="CONCLUTION" className="border h-8 flex items-center justify-center">
                  {subjectScore.status === 'CONFIRM' && subjectScore.average_score}
                </div>
              </div>
            </TableCell>
            <TableCell>{subjectScore.class_subject.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
