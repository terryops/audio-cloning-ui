import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// 在服务器启动时加载组件代码
let preloadedCodes: Record<string, string> = {}

function loadPreloadedCodes() {
  if (Object.keys(preloadedCodes).length > 0) {
    return preloadedCodes
  }

  try {
    // 尝试从多个可能的位置读取
    const possiblePaths = [
      // 开发环境
      join(process.cwd(), 'server', 'component-codes.json'),
      // Vercel 构建环境
      join(process.cwd(), '.output', 'server', 'component-codes.json'),
      // 备用路径
      join(dirname(fileURLToPath(import.meta.url)), '../component-codes.json'),
    ]

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        const data = readFileSync(path, 'utf-8')
        preloadedCodes = JSON.parse(data)
        console.log(`✓ Loaded component codes from: ${path}`)
        return preloadedCodes
      }
    }
  } catch (error) {
    console.error('Failed to load preloaded codes:', error)
  }

  return {}
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
    // 首先尝试从预加载的代码获取
    const codes = loadPreloadedCodes()
    if (codes[fileName]) {
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
    console.error('Error loading component code:', error)
    return {
      code: `// Failed to load code\n// Visit GitHub: https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    }
  }
})
