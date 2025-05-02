import PromptList from '@/components/prompt/PromptList';
import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'; // Import BreadcrumbLink and BreadcrumbPage
import { Button } from '@/components/ui/button'; // Import Button
import Link from 'next/link';
import React from 'react';

type Props = {}

const PromptPage = (props: Props) => {
  return (
    // Remove the outer "PromptPage" div
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center p-6 mb-4"> {/* Add margin-bottom */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* Use BreadcrumbLink for links */}
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator /> {/* Use self-closing separator */}
            <BreadcrumbItem>
              {/* Use BreadcrumbPage for the current page */}
              <BreadcrumbPage>Prompts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle />
      </div>
      {/* Add Create New Prompt button */}
      <div className="mb-4 px-6"> {/* Add padding to align with breadcrumbs */}
          <Link href="/dashboard/prompts/new">
            <Button>Create New Prompt</Button>
          </Link>
        </div>
      <PromptList />
    </div>
  )
}
export default PromptPage