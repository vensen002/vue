// 引用Nodejs 依赖模块
const fs = require('fs') // nodejs 文件系统
const path = require('path') // nodejs path 路径模块
const zlib = require('zlib') // nodejs 压缩
const rollup = require('rollup') // rollup JavaScript 打包器
const terser = require('terser') // JavaScript管理器和压缩器工具包

// 判断 dist 目录是否存在 不存在就创建dist目录
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

// 获取 构建配置文件
let builds = require('./config').getAllBuilds()

// 过滤配置，通过命令行参数过滤出满足条件的配置
// filter builds via command line arg
if (process.argv[2]) { // process.argv[2] == 脚本携带的第一个参数
  const filters = process.argv[2].split(',')
  // Array.filter() 返回条件为true 的数组
  builds = builds.filter(b => {
    // Array.some() 只要满足一项条件，就整体返回true
    // indexOf() 只要不存在就返回 -1，否则就返回遍历到的第一个满足元素的下标
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
}
// 构建Vuejs
build(builds)

/**
 * 通过function 声明函数，引擎会自动提升函数到顶部
 */
// 构建方法
function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /(min|prod)\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(async ({ output: [{ code }] }) => {
      if (isProd) {
        const {code: minifiedCode} =  await terser.minify(code, {
          toplevel: true,
          compress: {
            pure_funcs: ['makeMap'],
          },
          format: {
            ascii_only: true,
          }
        });
        const minified = (banner ? banner + '\n' : '') + minifiedCode
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
    }
    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
