// 导入一系列混入方法
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'

// Vue 的定义  它实际上就是⼀个⽤ Function 实现的类
/**
 * 为什么不是Class
 * 因为之后有很多 xxxMixin的函数调⽤，并把 Vue 当参数传⼊，
 * 它们的功能都是给 Vue 的 prototype 上扩展⼀些⽅法
 * Vue 按功能把这些扩展分散到多个模块中去实现，⽽不是在⼀个模块⾥实现所有，方便维护
 * 这种⽅式是⽤ Class 难以实现的
 */
function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    // Vue 是一个构造函数，并且应该使用 new 关键字来调用
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

//@ts-expect-error Vue has function type
initMixin(Vue)
//@ts-expect-error Vue has function type
stateMixin(Vue)
//@ts-expect-error Vue has function type
eventsMixin(Vue)
//@ts-expect-error Vue has function type
lifecycleMixin(Vue)
//@ts-expect-error Vue has function type
renderMixin(Vue)

// 双重断言
export default Vue as unknown as GlobalAPI
