declare let process: any


export default class FrontendSettings {
  readonly SENTRY           : string = process.env.SENTRY        ? process.env.SENTRY        : ''
  readonly REVISION         : string = process.env.REVISION      ? process.env.REVISION      : ''
}
