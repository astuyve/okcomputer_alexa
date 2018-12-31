export interface BasicAuthOption {
  user: string,
  pass: string
}

export interface TokenAuthOption {
  token: string
}

export class RequestOption {
  public static forRoute(url: string, options: BasicAuthOption = { user: null, pass: null }) {
    return {
      headers: RequestOption.basic(options.user, options.pass),
      json: true,
      uri: url
    }
  }

  public static basic(user: string, pass: string): any {
    const authString = Buffer.from(user + ":" + pass).toString('base64')
    return {
      Authorization: "Basic " + authString
    }
  }
}
