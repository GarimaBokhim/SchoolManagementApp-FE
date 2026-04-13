type ExcelRow = Record<string, string | number | null>

export interface ExcelPreviewModalProps {
  previewData: ExcelRow[]
  show: boolean
  onClose: () => void
  onSave: () => void
  loading: boolean
}