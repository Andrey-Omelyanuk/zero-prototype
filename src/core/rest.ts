import settings from './settings/index'
import { action } from 'mobx'
import { store } from 'mobx-orm'


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false
    }
    return true
}

function convertToText(obj) {
    //create an array that will later be joined into a string.
    var string = []

    //is object
    //    Both arrays and objects seem to return "object"
    //    when typeof(obj) is applied to them. So instead
    //    I am checking to see if they have the property
    //    join, which normal objects don't have but
    //    arrays do.
    if (obj == undefined) 
        return String(obj)
    else if (typeof(obj) == 'object' && (obj.join == undefined)) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                string.push('"'+prop + '": ' + convertToText(obj[prop]))
        }
        return '{' + string.join(',') + '}'
    } 
    //is array
    else if (typeof(obj) == 'object' && !(obj.join == undefined)) {
        for(let prop in obj) 
            string.push(convertToText(obj[prop]))
        return '[' + string.join(',') + ']'
    } 
    //is function
    else if (typeof(obj) == 'function') {
        string.push(obj.toString())
    } 
    //all other values can be done with JSON.stringify
    else {
        string.push(JSON.stringify(obj))
    }

    return string.join(',')
}

// if key is exist then data ready in store 
let cache = {}

// Decorator
export function rest(api: string) {
    return (cls) => {
        let model_name = cls.prototype.constructor.name

        store.models[model_name].save = (obj) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest()

                if (obj.id) xhr.open('PUT' , `${settings.BACKEND_API_URI}${api}/${obj.id}/`)
                else        xhr.open('POST', `${settings.BACKEND_API_URI}${api}/`)

                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.onreadystatechange = () => {

                    if (xhr.readyState !==   4)  return
                    if (![200, 201].includes(xhr.status)) reject(xhr.status + ': ' + xhr.statusText)
                    else {
                        let response = JSON.parse(xhr.responseText)
                        for(let key in response) {
                            if (key != 'id' || !obj[key]) {
                                obj[key] = response[key]
                            }
                        }
                        resolve(obj)
                    }
                }
                let obj_raw = {}
                for (let key in store.models[model_name].fields) {
                    if(store.models[model_name].fields[key].type == 'id' 
                    || store.models[model_name].fields[key].type == 'field') {
                        obj_raw[key] = obj[key]
                    }
                }
                xhr.send(JSON.stringify(obj_raw))
            })
        }

        store.models[model_name].delete = (obj) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest()
                xhr.open('DELETE', `${settings.BACKEND_API_URI}${api}/${obj.id}/`)
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !==   4)  return
                    if (xhr.status     !== 204)  reject(xhr.status + ': ' + xhr.statusText)
                    else {
                        obj.id = null
                        resolve(obj)
                    }
                }
                xhr.send()
            })
        }

        store.models[model_name].load = (cls, where, order_by, limit, offset) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest()
                let data = '' 
                if (!isEmpty(where)) data += 'where='+convertToText(where)
                // if (order_by) data += `&order_by=${JSON.stringify(order_by)}`
                // if (limit   ) data += `&limit=${JSON.stringify(limit)}`
                // if (offset  ) data += `&offset=${JSON.stringify(offset)}`
                let url = `${settings.BACKEND_API_URI}${api}/?${data}`

                if (cache[url] === undefined) cache[url] = true
                else { resolve(); return } 

                xhr.open('GET', url)
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !==   4)  return
                    if (xhr.status     !== 200)  reject(xhr.status + ': ' + xhr.statusText)
                    else {
                        let set = action('load', () => {
                            let objs = []
                            for(let obj of JSON.parse(xhr.responseText)) {
                                let instance = cls.get(obj.id)
                                if (instance) {
                                    // TODO: update field of instance
                                }
                                else {
                                    objs.push(new cls(obj))
                                }
                            }
                            resolve(objs)
                        })
                        set()
                    }
                }
                xhr.send()
            })
        }

    }
}