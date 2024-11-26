import { LuLayoutDashboard } from 'react-icons/lu'
import { SiGoogleclassroom } from 'react-icons/si'
import { PiStudent } from 'react-icons/pi'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { BiMath } from 'react-icons/bi'
import { GrSchedules } from 'react-icons/gr'
import { GrScorecard } from 'react-icons/gr'
import { IoDocumentText, IoNotificationsOutline } from 'react-icons/io5'
import { IoSettingsOutline } from 'react-icons/io5'

export const teacherNavs = [
  {
    label: 'Class',
    icon: SiGoogleclassroom,
    href: '/class',
  },
  {
    label: 'Schedule',
    icon: GrSchedules,
    href: '/schedule',
  },
  {
    label: 'Notification',
    icon: IoNotificationsOutline,
    href: '/notification',
  },
  {
    label: 'Documents',
    icon: IoDocumentText,
    href: '/documents',
  },
]

export const adminNavs = [
  {
    label: 'Dashboard',
    icon: LuLayoutDashboard,
    href: '/',
  },
  {
    label: 'Class',
    icon: SiGoogleclassroom,
    href: '/class',
  },
  {
    label: 'Student',
    icon: PiStudent,
    href: '/student',
  },
  {
    label: 'Teacher',
    icon: FaChalkboardTeacher,
    href: '/teacher',
  },
  {
    label: 'Subject',
    icon: BiMath,
    href: '/subject',
  },
  {
    label: 'Documents',
    icon: IoDocumentText,
    href: '/documents',
  },
  {
    label: 'Setting',
    icon: IoSettingsOutline,
    href: '/setting',
  },
]

export const studentNavs = [
  {
    label: 'Dashboard',
    icon: LuLayoutDashboard,
    href: '/',
  },
  {
    label: 'Schedule',
    icon: GrSchedules,
    href: '/schedule',
  },
  {
    label: 'Score',
    icon: GrScorecard,
    href: '/score',
  },
  {
    label: 'Notification',
    icon: IoNotificationsOutline,
    href: '/notification',
  },
  {
    label: 'Documents',
    icon: IoDocumentText,
    href: '/documents',
  },
]

export const DEFAULT_SCORE_SCHEMA = {
  '15MIN': 10,
  LESSION: 15,
  MIDDLE: 25,
  FINAL: 50,
}
