// 引入Vue
import Vue from './runtime-with-compiler'
import * as vca from 'v3'
import { extend } from 'shared/util'

// 扩展Vue
extend(Vue, vca)

import { effect } from 'v3/reactivity/effect'
Vue.effect = effect

// 默认导出
export default Vue
