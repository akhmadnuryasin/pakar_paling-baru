import {
  // IconLayoutDashboard,
  IconVirusSearch,
  // IconSpeakerphone,
  IconScale,
  IconAbacus,
  IconUserCircle,
  IconCarCrash,
  // IconUsers,
  IconRulerMeasure
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  // {
  //   title: 'Dashboard',
  //   label: '',
  //   href: '/',
  //   icon: <IconLayoutDashboard size={18} />,
  // },
  // {
  //   title: 'Pengguna',
  //   label: '',
  //   href: '/pengguna',
  //   icon: <IconUsers size={18} />,
  // },
  {
    title: 'Gejala',
    label: '',
    href: '/gejala',
    icon: <IconVirusSearch size={18} />,
  },
  {
    title: 'Kerusakan',
    label: '',
    href: '/kerusakan',
    icon: <IconCarCrash size={18} />,
  },
  {
    title: 'Probabilitas',
    label: '',
    href: '/probabilitas',
    icon: <IconAbacus size={18} />,
  },
  {
    title: 'Bobot Gejala',
    label: '',
    href: '/knowledge_base',
    icon: <IconScale size={18} />,
  },
  {
    title: 'Rules',
    label: '',
    href: '/rules',
    icon: <IconRulerMeasure size={18} />,
  },
  {
    title: 'Account',
    label: '',
    href: '/account',
    icon: <IconUserCircle size={18} />,
  }
]
