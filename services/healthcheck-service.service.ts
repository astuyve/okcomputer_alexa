import * as request from 'request-promise-native'
import { RequestOption } from './request-option';

export class HealthcheckService {

  constructor(
    public url: string
  ) { }

  public async lookup(): Promise<string> {
    const opt = RequestOption.forRoute(this.url, { user: process.env.OKCOMPUTER_USER, pass: process.env.OKCOMPUTER_PASS })
    const result = await request(opt)
    let returnString: string = ''
    
    for (const check_type in result)
    {      
      returnString += "Check Type " + check_type.replace('_', ' ')
      if (result[check_type]['success']) returnString += " has Passed! "
      if (!result[check_type]['success']) {
        returnString += " has Failed! " 
        returnString += "with message " + result[check_type]['message']
      }
      returnString += '\n\n'
    }

    return returnString
  }
}