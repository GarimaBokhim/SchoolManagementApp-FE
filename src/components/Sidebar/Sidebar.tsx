/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Icon } from '@iconify/react'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
} from 'react'
import adi from '../../../public/assets/adi.jpg'
import {
  BadgeCent,
  Banknote,
  BookCheck,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  ChevronDown,
  ChevronRight,
  Factory,
  Hand,
  LogOut,
  LucideProps,
  NotebookPen,
  SheetIcon,
  User,
  UserCog,
  Users,
  Home,
  Navigation,
  School,
  LockKeyholeOpen,
  Settings,
  NotepadText,
  School2Icon,
  Notebook,
  GiftIcon,
  NotepadTextDashedIcon,
  Package,
} from 'lucide-react'
import { ISidebar } from '@/types/ISidebar'
import { usePermissions } from '@/context/auth/PermissionContext'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import DialogButton from '../Buttons/DialogButton'
import { useSidebar } from '@/context/SidebarContext'
import Image from 'next/image'
import { useGetMenuStatus } from '@/app/SuperAdmin/navigation/menu/hooks'

type Props = {
  sideBarItems: ISidebar
  // All optional — defaults match existing school management colors exactly
  primaryColor?: string // active text + border color
  activeBg?: string // active item background
  activeSubBg?: string // active sub-item background
  containerClassName?: string // controls dark bg — e.g. "dark:bg-[#161B27]" for CRM
  containerStyle?: CSSProperties
}

// Read + parse localStorage synchronously on first client render so we don't
// have a render pass where `role` is '' for logged-in users (this was causing
// links to be built without the /enduser prefix and active-state matches to
// silently fail on first paint / after fast client-side navigations).
const readStoredUser = (): any => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('userDetails')
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Failed to parse user details:', err)
    return null
  }
}

const Sidebar: React.FC<Props> = ({
  sideBarItems,
  primaryColor = '#035BBA', // school management default
  activeBg = '#CCE3FC', // school management default
  activeSubBg = '#e5f1fe', // school management default
  containerClassName = '', // school management default
  containerStyle,
}) => {
  const { setMenuStatus } = usePermissions()
  const { isOpen } = useSidebar()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false) // Add this to fix hydration
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  const pathAfterFirst = `/${parts.slice(1).join('/')}`
  const navigate = useRouter()
  const [activeRole, setActiveRole] = useState<string | undefined>('')
  const [activeSubModule, setActiveSubModule] = useState<string | undefined>('')
  const [storedUser, setStoredUser] = useState<any>(null)
  const [submenuTop, setSubmenuTop] = useState<number>(0)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    setMounted(true)
    setStoredUser(readStoredUser())
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userDetails') setStoredUser(readStoredUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const role = storedUser?.role || ''
  const lowerRole = role?.toLowerCase() || ''

  const withRolePrefix = (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    let prefix = ''
    if (lowerRole === 'superadmin') prefix = 'superadmin'
    else if (lowerRole === 'admin') prefix = 'admin'
    else if (lowerRole === 'crm') prefix = 'crm'
    else if (lowerRole === 'enduser') prefix = 'enduser'
    else if (lowerRole === 'crmadmin') prefix = 'crmadmin'
    else prefix = lowerRole
    return `/${prefix}${cleanPath}`
  }

  const { data: menuStatus, refetch } = useGetMenuStatus(
    activeSubModule,
    activeRole
  )

  useEffect(() => {
    if (lowerRole === 'superadmin' || lowerRole === 'developeruser') {
      setMenuStatus([
        {
          menuName: 'add',
          isActive: true,
          submoduleId: '',
          icon: '',
          targetUrl: '',
          role: '',
          rank: 0,
        },
        {
          menuName: 'edit',
          isActive: true,
          submoduleId: '',
          icon: '',
          targetUrl: '',
          role: '',
          rank: 0,
        },
        {
          menuName: 'delete',
          isActive: true,
          submoduleId: '',
          icon: '',
          targetUrl: '',
          role: '',
          rank: 0,
        },
        {
          menuName: 'assign',
          isActive: true,
          submoduleId: '',
          icon: '',
          targetUrl: '',
          role: '',
          rank: 0,
        },
      ])
    }
  }, [lowerRole, setMenuStatus])

  useEffect(() => {
    const storedMenuStatus = localStorage.getItem('menuStatus')
    if (storedMenuStatus) setMenuStatus(JSON.parse(storedMenuStatus))
  }, [setMenuStatus])

  useEffect(() => {
    if (activeRole !== 'role' && menuStatus) {
      setMenuStatus(menuStatus)
      localStorage.setItem('menuStatus', JSON.stringify(menuStatus))
    }
  }, [activeRole, menuStatus, setMenuStatus])

  useEffect(() => {
    if (activeSubModule && activeRole) refetch()
  }, [refetch, activeRole, activeSubModule])

  useEffect(() => {
    if (!activeSection || isOpen) return
    const updatePosition = () => {
      const el = itemRefs.current[activeSection]
      if (el) setSubmenuTop(el.getBoundingClientRect().bottom)
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [activeSection, isOpen])

  const staticIcons: {
    [key: string]:
    | React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
    | React.ReactElement
  } = {
    Dashboard: Home,
    Navigation: Navigation,
    'Access Control': LockKeyholeOpen,
    'Institution SetUp': School,
    'Company SetUp': School2Icon,
    Students: Users,
    'Parents Information': (
      <Icon icon="mynaui:users-group" width="24" height="24" />
    ),
    Academics: BookOpen,
    'Fee and Accounting': Banknote,
    Finance: Banknote,
    Miscellaneous: GiftIcon,
    'Attendance Management': Hand,
    'Exam and Grading': BookCheck,
    'Class Management': NotebookPen,
    Certificate: NotepadText,
    'Staff Management': BriefcaseBusiness,
    User: User,
    Role: UserCog,
    Notice: Notebook,
    Inventory: Factory,
    Sales: BadgeCent,
    Report: SheetIcon,
    Account: Calculator,
    Setup: Settings,
    Applications: NotepadTextDashedIcon,
    'Academic Program': School,
    Services: Package,
    Consumer: User,
    Employee: BriefcaseBusiness
  }

  const sortByRank = (a: any, b: any) => (a.rank ?? 999) - (b.rank ?? 999)
  const handleLogout = () => navigate.push('/')

  const sortedModules = [...(sideBarItems?.module ?? [])]
    .sort(sortByRank)
    .map((item) => ({
      ...item,
      subModulesResponse: item.subModulesResponse
        ? [...item.subModulesResponse].sort(sortByRank)
        : [],
    }))

  const navLinks = sortedModules.map((item) => ({
    name: item.name,
    url: item.targetUrl,
    key: item.targetUrl,
    icon: staticIcons[item.name],
    subItems: item.subModulesResponse
      ? [...item.subModulesResponse].sort(sortByRank)
      : [],
    allowedRoles: [item.role],
  }))

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section))
    if (activeSection !== section) setActiveSubModule('')
  }

  const handleSelectSubModule = (
    id: string | undefined,
    role: string | undefined
  ) => {
    setActiveSubModule(id)
    setActiveRole(role)
  }

  const setItemRef = useCallback(
    (key: string) => (el: HTMLButtonElement | null) => {
      itemRefs.current[key] = el
    },
    []
  )

  if (!mounted) {
    return (
      <div
        className={`h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm
          transition-[width,background-color,border-color] duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-64' : 'w-16'}
          ${containerClassName || 'dark:bg-[#0A0A0A]'}`}
        style={containerStyle}
      />
    )
  }

  return (
    <div
      className={`h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm
        transition-[width,background-color,border-color] duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'w-64' : 'w-16'}
        ${containerClassName || 'dark:bg-[#0A0A0A]'}`}
      style={containerStyle}
    >
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 text-gray-800 dark:text-white bg-white dark:bg-inherit shadow-sm border-y dark:border-white space-y-2 md:space-y-0">
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto space-x-3">
          <Image
            src={adi}
            alt="User"
            width={30}
            className="rounded-full w-[2.5rem] h-[2.5rem] object-cover cursor-pointer bg-amber-200"
            priority
          />
          {isOpen && <span className="text-md font-semibold">{role}</span>}
        </div>
        <div className="flex justify-center w-full md:w-auto">
          <DialogButton
            icon={<LogOut className="hover:text-red-500 transition-colors" />}
            onConfirm={handleLogout}
            content="Do you want to log out?"
          />
        </div>
      </div>

      <div className="flex-1 mt-4 px-2 overflow-y-auto space-y-1">
        {navLinks
          .filter((item) => {
            if (lowerRole === 'superadmin' || lowerRole === 'developeruser')
              return (item.allowedRoles ?? [])
                .map((r: string) => r?.toLowerCase())
                .includes(lowerRole)
            return true
          })
          .map((item) => {
            const hasSubItems = item.subItems.length > 0
            const isOpenSection = activeSection === item.key
            const hasActiveChild = item.subItems.some(
              (child) => pathAfterFirst === child.targetUrl
            )
            const active = pathAfterFirst === item.url
            if (!hasSubItems) {
              return (
                <Link
                  key={item.key || item.name}
                  href={
                    lowerRole === 'superadmin' || lowerRole === 'developeruser'
                      ? item.url
                      : withRolePrefix(item.url)
                  }
                  className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-100 ease
                    ${active
                      ? 'font-semibold rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-300 dark:text-white hover:text-gray-800 dark:hover:text-black'
                    }`}
                  style={
                    active
                      ? { backgroundColor: activeBg, color: primaryColor }
                      : {}
                  }
                >
                  {active && (
                    <span
                      className="absolute left-0 top-0 h-full w-[3px] rounded-r-lg"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                  {item.icon &&
                    (React.isValidElement(item.icon)
                      ? item.icon
                      : React.createElement(item.icon, { size: 18 }))}
                  {isOpen && (
                    <span className="transition-opacity duration-300 ease-in-out opacity-100">
                      {item.name}
                    </span>
                  )}
                </Link>
              )
            }

            return (
              <div key={item.key || item.name} className="relative group">
                <button
                  ref={setItemRef(item.key)}
                  data-key={item.key}
                  onClick={() => toggleSection(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-100 ease-in-out
                    ${hasActiveChild
                      ? 'font-semibold rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-300 dark:text-white hover:text-gray-800 dark:hover:text-black'
                    }`}
                  style={
                    hasActiveChild
                      ? { backgroundColor: activeBg, color: primaryColor }
                      : {}
                  }
                >
                  {hasActiveChild && (
                    <span
                      className="absolute left-0 top-0 h-full w-[3px] rounded-r-lg"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    {item.icon &&
                      (React.isValidElement(item.icon)
                        ? item.icon
                        : React.createElement(item.icon, { size: 18 }))}
                    {isOpen && (
                      <span className="transition-all duration-100 ease-in-out">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {isOpen && (
                    <span>
                      {isOpenSection ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </span>
                  )}
                </button>

                {isOpen && (
                  <div
                    className={`ml-3 mt-1 flex flex-col gap-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                      ${isOpenSection ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {item.subItems.map((subItem, index) => {
                      const activeSub = pathAfterFirst === subItem.targetUrl
                      return (
                        <Link
                          key={`${subItem.targetUrl}-${subItem.subModulesId || index}`}
                          href={
                            lowerRole === 'superadmin' ||
                              lowerRole === 'developeruser'
                              ? subItem.targetUrl
                              : withRolePrefix(subItem.targetUrl)
                          }
                          onClick={() =>
                            handleSelectSubModule(
                              subItem.subModulesId!,
                              subItem.role
                            )
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ml-4 transition-colors
                            ${activeSub
                              ? 'font-medium'
                              : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-400 dark:text-[#e2e2e2] hover:text-gray-800 dark:hover:text-black'
                            }`}
                          style={
                            activeSub
                              ? {
                                backgroundColor: activeSubBg,
                                color: primaryColor,
                              }
                              : {}
                          }
                        >
                          {isOpen && (
                            <span className="transition-all duration-300 ease-in-out">
                              {subItem.name}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {!isOpen &&
                  isOpenSection &&
                  item.subItems.length > 0 &&
                  activeSection === item.key && (
                    <div
                      className={`fixed z-[9999] left-[4rem] bg-white shadow-lg border rounded-md min-w-[180px] ${containerClassName}`}
                      style={{
                        top: `${document
                          ?.querySelector(`[data-key='${item.key}']`)
                          ?.getBoundingClientRect().bottom ?? 0
                          }px`,
                      }}
                      onMouseEnter={() => setActiveSection(item.key)}
                    >
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={`floating-${subItem.targetUrl}-${subItem.subModulesId || index}`}
                          href={
                            lowerRole === 'superadmin' ||
                              lowerRole === 'developeruser'
                              ? subItem.targetUrl
                              : withRolePrefix(subItem.targetUrl)
                          }
                          className="flex items-center px-4 py-2 text-sm whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-400 dark:text-white"
                          style={
                            pathAfterFirst === subItem.targetUrl
                              ? {
                                backgroundColor: activeSubBg,
                                color: primaryColor,
                                fontWeight: 500,
                              }
                              : {}
                          }
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            )
          })}
      </div>

      {isOpen && (
        <div className="p-4 border-t border-gray-200 hidden md:block">
          <p className="text-xs text-gray-500">
            © 2025 SchoolManagement System
          </p>
        </div>
      )}
    </div>
  )
}

export default Sidebar
