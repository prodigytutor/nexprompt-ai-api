import PromptList from '@/components/prompt/PromptList'
import { ThemeToggle } from '@/components/theme-toggle'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Slash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const PromptPage = (props: Props) => {
  return (
    <div>PromptPage
        <div className="min-h-screen p-4">
      <div className="flex justify-between items-center p-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <Link href="/dashboard/voice-cloning">Prompt Management</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle />
      </div>
      <PromptList />
    </div>
                
    </div>
  )
}
export default PromptPage