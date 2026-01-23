import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// 缓存：导入预生成的组件代码
let componentCodesCache: Record<string, string> | null = null

async function loadComponentCodes() {
  if (componentCodesCache) {
    return componentCodesCache
  }

  try {
    // 尝试导入预生成的代码索引
    const codesModule = await import('../codes/index')
    componentCodesCache = codesModule.componentCodes || {}
    console.log(`✓ Loaded ${Object.keys(componentCodesCache).length} prebuilt component codes`)
    return componentCodesCache
  } catch (error) {
    console.log('Prebuilt codes not found, using filesystem fallback')
    return {}
  }
}

export default defineEventHandler(async (event) => {
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
    // 首先尝试从预生成的代码获取
    const prebuiltCodes = await loadComponentCodes()
    if (prebuiltCodes[fileName]) {
      return { code: prebuiltCodes[fileName] }
    }

    // 开发环境：直接读取文件
    const filePath = join(process.cwd(), 'components', fileName)
    if (existsSync(filePath)) {
      const code = readFileSync(filePath, 'utf-8')
      return { code }
    }

    // 如果都找不到
    throw new Error('Component not found')
  } catch (error) {
    console.error('Error loading component code:', error)
    const githubUrl = `https://github.com/terryops/audio-cloning-ui/blob/main/components/${fileName}`
    return {
      code: `// Failed to load component code\n// View source on GitHub: ${githubUrl}`
    }
  }
})
