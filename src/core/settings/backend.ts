/**
 *  Read settings from backend and get access for it (only for read).
 */

export class BackendSettings {

  private readonly _backend_api_url: string = ''

  ready : Promise<any>

  DEBUG               : boolean
  VAPID_PUBLIC_KEY    : string

  PUBNUB_PUBLISH_KEY  : string
  PUBNUB_SUBSCRIBE_KEY: string

  DROPBOX_CLIENT_ID   : string
  FACEBOOK_CLIENT_ID  : string
  GOOGLE_CLIENT_ID    : string
  LINKEDIN_CLIENT_ID  : string

  constructor(backend_api_url) {
    this._backend_api_url = backend_api_url

    this.ready = new Promise((resolve, reject) => {
      // get settings from backend
      let xhr = new XMLHttpRequest()
      xhr.open('GET', `${this._backend_api_url}settings/`)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.onreadystatechange = () => {
        if (xhr.readyState !==   4)  return
        if (xhr.status     !== 200)  reject(xhr.status + ': ' + xhr.statusText)
        else {
          let res = JSON.parse(xhr.responseText)
          this.DEBUG                = res.DEBUG                 ? res.DEBUG                 : false
          this.VAPID_PUBLIC_KEY     = res.VAPID_PUBLIC_KEY      ? res.VAPID_PUBLIC_KEY      : ''
          this.PUBNUB_PUBLISH_KEY   = res.PUBNUB_PUBLISH_KEY    ? res.PUBNUB_PUBLISH_KEY    : ''
          this.PUBNUB_SUBSCRIBE_KEY = res.PUBNUB_SUBSCRIBE_KEY  ? res.PUBNUB_SUBSCRIBE_KEY  : ''
          this.DROPBOX_CLIENT_ID    = res.DROPBOX_CLIENT_ID     ? res.DROPBOX_CLIENT_ID     : ''
          this.FACEBOOK_CLIENT_ID   = res.FACEBOOK_CLIENT_ID    ? res.FACEBOOK_CLIENT_ID    : ''
          this.GOOGLE_CLIENT_ID     = res.GOOGLE_CLIENT_ID      ? res.GOOGLE_CLIENT_ID      : ''
          this.LINKEDIN_CLIENT_ID   = res.LINKEDIN_CLIENT_ID    ? res.LINKEDIN_CLIENT_ID    : ''
          resolve(this)
        }
      }
      xhr.send()
    })
  }
}
