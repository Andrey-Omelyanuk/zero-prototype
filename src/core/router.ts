import { observable, action, observe } from 'mobx'
declare let window

let states_options: { [state_name: string]: { type: any, default: any, reset_options: any, enum: any } } = {}
let order_priority: string[] = []

function state (cls: any, field_name: string, reset_options, type: any, enum_type: any = null) {
  if (states_options[field_name])
    throw new Error('State was already setup')
  observable(cls, field_name)
  order_priority.push(field_name)
  states_options[field_name] = { type: type, default: null, reset_options: reset_options, enum : enum_type }
}

export function _number (reset_options: any) { return function (cls: any, field_name: string) { state(cls, field_name, reset_options, 'number') } }
export function _string (reset_options: any) { return function (cls: any, field_name: string) { state(cls, field_name, reset_options, 'string') } }
export function _boolean(reset_options: any) { return function (cls: any, field_name: string) { state(cls, field_name, reset_options, 'boolean') } }
export function _enum   (reset_options: any, enum_type: any) { return function (cls: any, field_name: string) { state(cls, field_name, reset_options, 'enum', enum_type) } }

export class BaseRouter {
  log          : boolean = false
  _transacton  : boolean = false

  init() {
    window.router = this

    if (this.log) console.log(`[router] -------------------------------------------- defaults: `)
    // save 'default value' before init observes
    Object.keys(states_options).forEach((state_name) => {
      let state_option = states_options[state_name]
      state_option.default = this[state_name] 
      if (this.log) console.log(`[router] ${state_name} = ${state_option.default}`)
    })

    Object.keys(states_options).forEach((state_name) => {
      // when something was changed (not in transaction!) 
      // we should start transaction 
      // and then reset states to default and update router state
      observe(this, state_name as any, () => {
          if (this._transacton) return
          this._transacton = true
          if (this.log) console.log(`[router] --------------------------------------- reaction start`)
          if (this.log) console.log(`[router] ${state_name}: ${this[state_name]}`)
          this.resetStates(this, state_name)

          let url = this.generateUrl()
          if (this.log) console.log(`[router] new url: ${url}`)
          this.history.push(url)

          this._transacton = false
        }
      )
    })

    this.setValuesFromUrl(window.location.pathname)
  }

  history = null
  setHistory(history) {
    if (this.history == null) {
      this.history = history
    }
  }

  resetStates(states, state_name) {
    let state_option = states_options[state_name]
    if (state_option.reset_options) {
      for (let key in states_options) {
        if (key != state_name && state_option.reset_options(key)) {
          states[key] = states_options[key].default
          if (this.log && states === this) console.log(`[router] ${key} = ${states[key]}`)
        }
      }
    }
  }
  
  resetAllStates(states) {
    if (this.log) console.log(`[router] -------------------------------------------- reset states:`)
    for (let key in states_options) {
      this[key] = states_options[key].default
      if (this.log) console.log(`[router] ${key}: ${this[key]}`)
    }
  }


  generateUrl(diff: any = false) {
    // create a copy of states for change it
    let states = {}
    for (let key of order_priority) {
      states[key] = this[key]
    }
    let log  = this.log 
    for (let key in diff) {
      states[key] = diff[key]
      this.resetStates(states, key)
    }
    this.log = log

    let url_path = '/'
    for (let state_name of order_priority) {
      let state = states_options[state_name]
      switch(state.type) {
        case 'boolean': 
          if (states[state_name]) {
            url_path += `${state_name}/`
          }
          break
        case 'number':
        case 'string':
          if (states[state_name] != null) {
            url_path += `${state_name}/${states[state_name]}/`
          }
          break
        case 'enum':
          if (states[state_name] != null) {
            url_path += `${states[state_name]}/`
          }
          break
        default:
          throw Error('Unknown type.')
      }
    }

    return url_path
  }

  @action setValuesFromUrl(url: string) {
    if (this._transacton) {
      throw new Error('You cannot update states from Url because transaction is already on.')
    }

    this._transacton = true
    // this.resetStates()
    if (this.log) console.log(`[router] ------------------------------------------- set values from url`)
    if (this.log) console.log(`[router] ${url}`)
    let splited = url.split('/')

    for (let i = 0; i < splited.length; i++ ) {
      if (splited[i]) {

        let state_name = null
        if (states_options[splited[i]]) state_name = splited[i]
        // try to find it into enums
        else {
          for(let option_name in states_options) {
            let option = states_options[option_name]
            if (option.type == 'enum') {
              for(let enum_name in option.enum) {
                if (option.enum[enum_name] == splited[i]) {
                  state_name = option_name
                  break
                }
              }
            }
            if (state_name) break
          }
        }
        if (state_name === null) {
          throw new Error(`Unknown state of url: ${splited[i]}`)
        }

        switch(states_options[state_name].type) {
          case 'boolean':
            this[state_name] = true
            break
          case 'number':
            this[state_name] = parseInt(splited[i+1])
            i++
            break
          case 'string': 
            this[state_name] = splited[i+1] 
            i++
            break
          case 'enum': 
            this[state_name] = splited[i] 
            break
          default:
            this[state_name] = splited[i]
        }

        if (this.log) console.log(`[router] ${state_name} = ${this[state_name]}`)
      }
    }
    this._transacton = false
  }
}