import { documentsEndpoint } from '@/config/endpoints'
import { updateSearchParams } from '@/helper/logics'
import { useGet } from '@/hooks/useGet'
import { IDocument } from '@/types'
import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/pagination'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { MdDeleteOutline, MdModeEdit } from 'react-icons/md'
import EditDocment from '../EditDocument'
import { Spinner } from '@nextui-org/spinner'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useMutation } from '@/hooks/useMutation'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Role } from '@/helper/enums'

const RECORD_PER_PAGE = 10

const cols: { key: string; label: string }[] = [
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'url',
    label: 'Link',
  },
  {
    key: 'action',
    label: '',
  },
]

export default function DocumentList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const subjectID = searchParams.get('subjectID')
  const page = Number(searchParams.get('page')) || 1
  const { user } = useSelector((state: RootState) => state.auth)

  const [selectedDocumentEdit, setSelectedDocumentEdit] = useState<IDocument | null>(null)

  const { reFetch, response, pending } = useGet<{
    count: number
    results: IDocument[]
  }>(
    {
      url: documentsEndpoint.BASE,
      config: {
        params: {
          limit: RECORD_PER_PAGE,
          offset: (page - 1) * RECORD_PER_PAGE,
          title: search,
          subject: subjectID,
        },
      },
    },
    {
      deps: [page, search, subjectID],
    },
  )

  const deleteDocumentMuation = useMutation()

  const handleDeleteDocument = async (docID: string) => {
    const { error } = await deleteDocumentMuation.mutation({
      method: 'delete',
      url: `${documentsEndpoint.BASE}/${docID}`,
    })

    if (error) {
      toast.error('Can not delete document')
      return
    }

    toast.success('Document deleted')
    reFetch()
  }

  return (
    <div className="my-10">
      <Table>
        <TableHeader columns={cols}>
          {(col) => (
            <TableColumn key={col.key} align="center">
              {col.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={pending} loadingContent={<Spinner />}>
          {(response?.results || []).map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell>
                <Link target="_blank" href={doc.url} className="underline">
                  {doc.url}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-center">
                  {user?.role === Role.ADMIN && (
                    <>
                      <Button isIconOnly color="primary" variant="flat" onClick={() => setSelectedDocumentEdit(doc)}>
                        <MdModeEdit />
                      </Button>
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Button isIconOnly color="danger" variant="flat">
                            <MdDeleteOutline />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="w-[200px] p-2">
                            <p className="text-center font-semibold text-red-950">Confirm delete this document?</p>
                            <Button
                              onClick={() => handleDeleteDocument(doc.id)}
                              color="danger"
                              className="w-full"
                              isLoading={deleteDocumentMuation.pending}
                            >
                              Confirm
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        showControls
        showShadow
        className="mt-10 flex justify-center"
        page={page}
        total={Math.ceil((response?.count || 0) / RECORD_PER_PAGE)}
        onChange={(page) => {
          router.replace(
            updateSearchParams({
              page,
            }),
          )
        }}
      />
      <EditDocment
        isOpen={!!selectedDocumentEdit}
        document={selectedDocumentEdit}
        onClose={() => setSelectedDocumentEdit(null)}
        onFinish={() => {
          setSelectedDocumentEdit(null)
          reFetch()
        }}
      />
    </div>
  )
}
