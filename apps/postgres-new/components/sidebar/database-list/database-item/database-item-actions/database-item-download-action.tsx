import { Download } from 'lucide-react'
import { useApp } from '~/components/app-provider'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { LocalDatabase } from '~/lib/db'
import { downloadFile, titleToKebabCase } from '~/lib/util'

export type DatabaseItemDownloadActionProps = { database: LocalDatabase }

export function DatabaseItemDownloadAction(props: DatabaseItemDownloadActionProps) {
  const { dbManager } = useApp()

  async function handleMenuItemSelect(e: Event) {
    if (!dbManager) {
      throw new Error('dbManager is not available')
    }

    const db = await dbManager.getDbInstance(props.database.id)
    const dumpBlob = await db.dumpDataDir()

    const fileName = `${titleToKebabCase(props.database.name ?? 'My Database')}-${Date.now()}`
    const file = new File([dumpBlob], fileName, { type: dumpBlob.type })

    downloadFile(file)
  }

  return (
    <DropdownMenuItem className="gap-3" onSelect={handleMenuItemSelect}>
      <Download size={16} strokeWidth={2} className="flex-shrink-0" />

      <span>Download</span>
    </DropdownMenuItem>
  )
}