'use server'

import prisma from '@/lib/db'

export async function createPrompt(formData: FormData) {
  const title = formData.get('title')
  const text = formData.get('text')
  const url = formData.get('url')

  const newPrompt = await prisma.prompt.create({
    data: {
      title: title?.toString() ?? '',
      content: text?.toString() ?? '',
      url: url?.toString() ?? '',
      vote: 0,
    },
  })

  await prisma.$accelerate.invalidate({
    tags: ['prompts'],
  })

  // console.log({ newPrompt }, 'has been created.')
  return newPrompt
}