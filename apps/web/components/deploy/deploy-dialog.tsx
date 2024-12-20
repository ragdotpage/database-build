'use client'

import { generateProjectName } from '@database.build/deploy/supabase'
import { Loader } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useIntegrationQuery } from '~/data/integrations/integration-query'
import { SupabaseIcon } from '../supabase-icon'
import { SchemaOverlapWarning } from './schema-overlap-warning'

export type DeployDialogProps = {
  databaseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeployDialog({ databaseId, open, onOpenChange, onConfirm }: DeployDialogProps) {
  const { data: integration } = useIntegrationQuery('Supabase')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <SupabaseIcon />
            Deploy to Supabase
          </DialogTitle>
          <div className="py-2 border-b" />
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-4">
          {!integration ? (
            <Loader
              className="animate-spin self-center justify-self-center"
              size={36}
              strokeWidth={0.75}
            />
          ) : (
            <div className="flex flex-col gap-2">
              You are about to deploy your in-browser database to Supabase. This will create a new
              Supabase project under your linked organization.
              <DeployCard
                organization={integration.organization}
                projectName={generateProjectName(databaseId)}
              />
              <SchemaOverlapWarning databaseId={databaseId} />
              Would you like to deploy this database?
            </div>
          )}
        </DialogDescription>
        <DialogFooter className="mt-1">
          <Button
            variant="secondary"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>Deploy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type DeployCardProps = {
  organization: { id: string; name: string }
  projectName: string
}

function DeployCard({ organization, projectName }: DeployCardProps) {
  return (
    <div className="flex flex-col gap-0 rounded-md my-3 p-1 border border-primary/25">
      <DeployCardRow label="Organization">
        <a
          href={`${process.env.NEXT_PUBLIC_SUPABASE_PLATFORM_URL}/dashboard/org/${organization.id}/general`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {organization.name}
        </a>{' '}
        <span className="text-sm italic">({organization.id})</span>
      </DeployCardRow>
      <div className="my-1 border-b border-primary/10" />
      <DeployCardRow label="New project name">{projectName}</DeployCardRow>
    </div>
  )
}

type DeployCardRowProps = PropsWithChildren<{
  label: string
}>

function DeployCardRow({ label, children }: DeployCardRowProps) {
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="font-bold w-36 text-right">{label}</div>
      <div className="mx-1 border-r border-primary/10 self-stretch" />
      <div>{children}</div>
    </div>
  )
}
