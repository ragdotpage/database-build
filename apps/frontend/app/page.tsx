'use client'

import { generateId } from 'ai'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import Workspace from '~/components/workspace'
import { useDatabaseCreateMutation } from '~/data/databases/database-create-mutation'
import { useDatabaseUpdateMutation } from '~/data/databases/database-update-mutation'
import { getDb } from '~/lib/db'
import { useLocalStorage } from '~/lib/hooks'

export const dynamic = 'force-static'

export default function Page() {
  const router = useRouter()

  const { mutateAsync: createDatabase } = useDatabaseCreateMutation()
  const { mutateAsync: updateDatabase } = useDatabaseUpdateMutation()

  /**
   * Preloads next empty database so that it is ready immediately.
   */
  const preloadDb = useCallback(
    async (id: string) => {
      await createDatabase({ id, isHidden: true })
      await getDb(id)
    },
    [createDatabase]
  )

  // Track the next database ID in local storage
  const [nextDatabaseId] = useLocalStorage('next-db-id', generateId())

  // The very first DB needs to be loaded on mount
  useEffect(() => {
    preloadDb(nextDatabaseId)
  }, [nextDatabaseId, preloadDb])

  return (
    <Workspace
      databaseId={nextDatabaseId}
      onStart={async () => {
        // Make the DB no longer hidden
        await updateDatabase({ id: nextDatabaseId, name: null, isHidden: false })

        // Navigate to this DB's path
        router.push(`/d/${nextDatabaseId}`)

        // Pre-load the next DB (but without causing a re-render)
        const nextId = generateId(12)
        localStorage.setItem('next-db-id', JSON.stringify(nextId))
        preloadDb(nextId)
      }}
    />
  )
}