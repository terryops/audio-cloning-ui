import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const fileName = query.file as string

  if (!fileName) {
    throw createError({
      statusCode: 400,
      message: 'Missing file parameter'
    })
  }

  // 安全检查：只允许读取 components 目录下的 .vue 文件
  if (!fileName.endsWith('.vue') || fileName.includes('..') || fileName.includes('/')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file name'
    })
  }

  try {
    const filePath = join(process.cwd(), 'components', fileName)
    const code = readFileSync(filePath, 'utf-8')
    return { code }
  } catch (error) {
    throw createError({
      statusCode: 404,
      message: `Component not found: ${fileName}`
    })
  }
})
