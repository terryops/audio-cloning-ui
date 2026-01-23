import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// 缓存组件代码
let componentCodes: Record<string, string> | null = null

const loadComponentCodes = () => {
  if (componentCodes) return componentCodes

  try {
    // 尝试从预生成的 JSON 文件加载（生产环境）
    const jsonPath = join(process.cwd(), 'public', 'component-codes.json')
    if (existsSync(jsonPath)) {
      const data = readFileSync(jsonPath, 'utf-8')
      componentCodes = JSON.parse(data)
      return componentCodes
    }
  } catch (error) {
    console.error('Failed to load component-codes.json:', error)
  }

  return null
}

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
    // 首先尝试从预生成的 JSON 加载（生产环境）
    const codes = loadComponentCodes()
    if (codes && codes[fileName]) {
      return { code: codes[fileName] }
    }

    // 开发环境：直接读取文件
    const filePath = join(process.cwd(), 'components', fileName)
    if (existsSync(filePath)) {
      const code = readFileSync(filePath, 'utf-8')
      return { code }
    }

    // 如果都找不到，返回提示
    return {
      code: `// Source code not available\n// Visit GitHub: https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    }
  } catch (error) {
    return {
      code: `// Failed to load code\n// Visit GitHub: https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    }
  }
})
