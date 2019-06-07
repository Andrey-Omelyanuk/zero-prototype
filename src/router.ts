import { computed } from 'mobx'
import { BaseRouter, _boolean, _number, _enum } from 'src/core/router'



class Router extends BaseRouter {
  log = true
  // @_type(reset_options) value_name = default value'
}

let router = new Router() 
router.init()
export default router
