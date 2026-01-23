import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// 尝试导入预生成的组件代码
let preloadedCodes: Record<string, string> = {}

try {
  // 在构建时，这个文件会存在
  const codesModule = await import('../component-codes.json')
  preloadedCodes = codesModule.default || codesModule
} catch (error) {
  console.log('Component codes not preloaded, will read from filesystem')
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
    // 首先尝试从预加载的代码获取（生产环境）
    if (preloadedCodes[fileName]) {
      return { code: preloadedCodes[fileName] }
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
    console.error('Error loading component code:', error)
    return {
      code: `// Failed to load code\n// Visit GitHub: https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    }
  }
})
