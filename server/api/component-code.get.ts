import { readFileSync, existsSync } from 'fs'
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
    // 仅在开发环境读取文件
    const filePath = join(process.cwd(), 'components', fileName)
    if (existsSync(filePath)) {
      const code = readFileSync(filePath, 'utf-8')
      return { code }
    }

    // 生产环境或文件不存在：返回 GitHub 链接
    const githubUrl = `https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    return {
      code: `/**
 * Component: ${fileName}
 *
 * Source code is available on GitHub:
 * ${githubUrl}
 *
 * This is a production build and source files are not included.
 * To view the source code, please visit the GitHub repository above.
 */`
    }
  } catch (error) {
    console.error('Error loading component code:', error)
    const githubUrl = `https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    return {
      code: `/**
 * Failed to load component code
 *
 * View source on GitHub:
 * ${githubUrl}
 */`
    }
  }
})
