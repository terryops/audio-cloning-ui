import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// 导入预生成的组件代码（在构建时生成）
let componentCodes: Record<string, string> = {}

try {
  // 动态导入组件代码模块
  const codesModule = await import('../utils/component-codes')
  componentCodes = codesModule.componentCodes || {}
  console.log(`✓ Loaded ${Object.keys(componentCodes).length} component codes`)
} catch (error) {
  console.log('Component codes module not found, will use filesystem fallback')
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
    if (componentCodes[fileName]) {
      return { code: componentCodes[fileName] }
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
