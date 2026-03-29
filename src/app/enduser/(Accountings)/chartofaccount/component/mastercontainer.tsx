import { useRef, useState } from 'react'
import Addition from '@/assets/square-plus-solid.svg'
import { useGetChartOfAccount } from '../hooks'
import {
  Folder as FolderIcon,
  ChevronDown,
  ChevronRight,
  Circle as Dot,
  FolderClosed,
} from 'lucide-react'
import AddL from '@/app/enduser/(Accountings)/Ledger/pages/Add'
import { IChart, ISubLedgerGroupResponse } from '../types/Ichartofaccount'
import Add from '@/app/enduser/(Accountings)/_LedgerGroup/pages/Add'
import AddSubLedger from '@/app/enduser/(Accountings)/_SubLedgerGroup/pages/Add'

const MasterContainer = () => {
  const { data: allMasters } = useGetChartOfAccount() as {
    data: IChart[]
  }
  const [selectedLedgerGroup, setSelectedLedgerGroup] = useState('')
  const [selectedMaster, setSelectedMaster] = useState('')
  const [selectedSubLedgerGroup, setSelectedSubLedgerGroup] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  )
  const [expandedMasters, setExpandedMasters] = useState<string[]>([])

  const toggleGroup = (groupId: string, hasContent: boolean) => {
    if (!hasContent) return
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const toggleMaster = (name: string, hasContent: boolean) => {
    if (!hasContent) return
    setExpandedMasters((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }
  const [showAddLedgerGroupForm, setShowAddLedgerGroupForm] = useState(false)
  const handleOpenAddLedgerGroupForm = (
    e: React.MouseEvent,
    selectedMaster: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedMaster(selectedMaster)
    setShowAddLedgerGroupForm(true)
  }
  const inputRefForLedgerGroup = useRef<HTMLInputElement>(null)
  const handleCloseAddLedgerGroup = () => {
    setShowAddLedgerGroupForm(false)
    setTimeout(() => {
      inputRefForLedgerGroup.current?.focus()
    }, 100)
  }

  const [showAddSubLedgerGroupForm, setShowAddSubLedgerGroupForm] =
    useState(false)
  const [subLedgerGroupIdAdded, setSubLedgerGroupIdAdded] = useState(false)
  const handleOpenAddSubLedgerGroupForm = (
    e: React.MouseEvent,
    selectedLedgerGroupId: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedLedgerGroup(selectedLedgerGroupId)
    setSubLedgerGroupIdAdded(true)
    setShowAddSubLedgerGroupForm(true)
  }
  const inputRefForSubLedgerGroup = useRef<HTMLInputElement>(null)

  const handleCloseAddSubLedgerGroupForm = () => {
    setShowAddSubLedgerGroupForm(false)
    setTimeout(() => {
      inputRefForSubLedgerGroup.current?.focus()
    }, 100)
  }
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false)
  const handleOpenAddLedgerForm = (
    e: React.MouseEvent,
    selectedSubLedgerGroup: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedSubLedgerGroup(selectedSubLedgerGroup)
    setShowAddLedgerForm(true)
  }
  const inputRefForLedger = useRef<HTMLInputElement>(null)
  const handleCloseAddLedgerForm = () => {
    setShowAddLedgerForm(false)
    setTimeout(() => {
      inputRefForLedger.current?.focus()
    }, 100)
  }
  return (
    <div className="w-full p-4 pl-6 dark:bg-[#0d0d0f] dark:text-white">
      <h1 className="font-semibold text-xl mb-6">Chart Of Accounts</h1>

      {allMasters?.map((master) => {
        const hasMasterContent = master.ledgerGroupResponses.length > 0
        const isMasterExpanded = expandedMasters.includes(master.id)

        return (
          <div
            key={master.id}
            className="border-t border-gray-300 dark:border-gray-700 py-4 pl-4"
          >
            <div
              className={`font-semibold text-md flex items-center gap-2 ${
                hasMasterContent
                  ? 'cursor-pointer'
                  : 'cursor-default opacity-50'
              }`}
              onClick={() => toggleMaster(master.id, hasMasterContent)}
            >
              <FolderClosed size={14} />
              {master.name}
              <div
                className={` font-normal text-sm
                ${
                  master.balanceType === 'Dr' ? 'text-teal-500' : 'text-red-500'
                }
                `}
              >
                &nbsp; ({master.balance} &nbsp;
                {master.balanceType})
              </div>
              <button
                type="button"
                onClick={(e) => handleOpenAddLedgerGroupForm(e, master.id)}
                className="text-red-500 hover:text-red-700 sm:p-0 flex"
              >
                <img
                  src={Addition}
                  alt="Add Item"
                  className="ml-3 w-4 h-4 mt-1  sm:w-4 sm:h-4"
                />
              </button>
            </div>

            {isMasterExpanded && (
              <div className="mt-2 space-y-2">
                {master.ledgerGroupResponses.map((group) => {
                  const groupId = `${master.id}-${group.id}`
                  const hasGroupContent =
                    group.SubLedgerGroupResponses.length > 0
                  const isGroupExpanded = expandedGroups[groupId]

                  return (
                    <div
                      key={group.id}
                      className="border-t border-gray-200 dark:border-gray-800 pt-2"
                    >
                      <button
                        onClick={() => toggleGroup(groupId, hasGroupContent)}
                        className={`w-full flex items-center justify-between text-left px-2 py-1 rounded ${
                          hasGroupContent
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                            : 'cursor-default'
                        }`}
                        // disabled={!hasGroupContent}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium pl-6">
                          <FolderIcon size={12} />
                          {group.name}
                          <div
                            className={` font-normal text-sm
                ${group.balanceType === 'Dr' ? 'text-teal-500' : 'text-red-500'}
                `}
                          >
                            &nbsp; ({Math.abs(group.balance)}{' '}
                            {group.balanceType})
                          </div>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleOpenAddSubLedgerGroupForm(e, group.id)
                            }
                            className="text-red-500 hover:text-red-700 sm:p-0 flex"
                          >
                            <img
                              src={Addition}
                              alt="Add Item"
                              className="ml-3 w-4 h-4 mt-1  sm:w-4 sm:h-4"
                            />
                          </button>
                        </div>
                        {hasGroupContent && (
                          <div>
                            {isGroupExpanded ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </div>
                        )}
                      </button>

                      {isGroupExpanded &&
                        group.SubLedgerGroupResponses.map(
                          (subGroup: ISubLedgerGroupResponse) => (
                            <div
                              key={subGroup.id}
                              className="mt-2 px-4 border-l border-gray-300 dark:border-gray-700"
                            >
                              <div className="font-medium text-sm pl-6 py-1 flex text-center">
                                {subGroup.name}
                                <div
                                  className={` font-normal text-sm
                ${
                  subGroup.balanceType === 'Dr'
                    ? 'text-teal-500'
                    : 'text-red-500'
                }
                `}
                                >
                                  &nbsp; ({Math.abs(subGroup.balance)}{' '}
                                  {subGroup.balanceType})
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleOpenAddLedgerForm(e, subGroup.id)
                                  }
                                  className="text-red-500 hover:text-red-700 sm:p-0 flex"
                                >
                                  <img
                                    src={Addition}
                                    alt="Add Item"
                                    className="ml-3 w-4 h-4 mt-1  sm:w-4 sm:h-4"
                                  />
                                </button>
                              </div>
                              <div className="mt-1 space-y-1">
                                {subGroup.ledgerResponses.map((ledger) => (
                                  <div
                                    key={ledger.id}
                                    className="flex items-center gap-2 pl-12 text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    <Dot size={6} />
                                    <span className="truncate">
                                      {ledger.name}
                                    </span>
                                    <div
                                      className={` font-normal text-sm
                ${
                  ledger.balanceType === 'Dr' ? 'text-teal-500' : 'text-red-500'
                }
                `}
                                    >
                                      &nbsp; ({Math.abs(ledger.balance)}{' '}
                                      {ledger.balanceType})
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      {showAddLedgerForm && (
        <div className="fixed inset-0 ml-[13.7%] bg-[#FBFBFB] bg-opacity-70 flex items-center justify-center z-[100]">
          <AddL
            visible
            onClose={handleCloseAddLedgerForm}
            selectedSubLedgerGroup={selectedSubLedgerGroup}
          />
        </div>
      )}
      {showAddSubLedgerGroupForm && (
        <div className="fixed inset-0 ml-[13.7%] bg-[#FBFBFB] bg-opacity-70 flex items-center justify-center z-[100]">
          <AddSubLedger visible onClose={handleCloseAddSubLedgerGroupForm} />
        </div>
      )}
      {showAddLedgerGroupForm && (
        <div className="fixed inset-0 ml-[13.7%] bg-[#FBFBFB] bg-opacity-70 flex items-center justify-center z-[100]">
          <Add
            visible
            onClose={handleCloseAddLedgerGroup}
            selectedMaster={selectedMaster}
          />
        </div>
      )}
    </div>
  )
}

export default MasterContainer
