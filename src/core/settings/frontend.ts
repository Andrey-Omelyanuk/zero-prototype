import { BackendSettings } from './backend'
declare let process: any


export default class FrontendSettings {
  readonly backend : BackendSettings
  readonly BACKEND_API_URI  : string = process.env.API_URI       ? process.env.API_URI       : 'http://localhost:8000/api/'
  readonly REDIRECT_URI     : string = process.env.REDIRECT_URI  ? process.env.REDIRECT_URI  : 'http://localhost:3000/'
  readonly SENTRY           : string = process.env.SENTRY        ? process.env.SENTRY        : ''
  readonly INTERCOME        : string = process.env.INTERCOME     ? process.env.INTERCOME     : ''
  readonly APPCUES          : string = process.env.APPCUES       ? process.env.APPCUES       : ''
  readonly REVISION         : string = process.env.REVISION      ? process.env.REVISION      : ''

  constructor() {
    this.backend = new BackendSettings(this.BACKEND_API_URI)
  }
}
