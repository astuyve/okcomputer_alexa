import { ErrorHandler, RequestHandler, SkillBuilders } from 'ask-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { HealthcheckService } from './services/healthcheck-service.service'

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Sports Engine Platform Health Check! You can say "Check on Ngin" or "How\'s Membership Service?"';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
}

export const test: APIGatewayProxyHandler = async(event, context) => {

  let service = new HealthcheckService(process.env.NGIN_URL)
  let result = await service.lookup()
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
      input: event,
    }),
  }
}

export const GetNginHealthHandler: RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'checkNginHealth';
  },
  async handle(handlerInput) {
    let service = new HealthcheckService(process.env.NGIN_URL)
    let result = await service.lookup()

    return handlerInput.responseBuilder
        .speak(result)
        .withSimpleCard('Ngin Health Check', result)
        .getResponse();
  }
}

export const GetMSHealthHandler: RequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'checkMembershipServiceHealth';
  },
  async handle(handlerInput) {
    let service = new HealthcheckService(process.env.MEMBERSHIP_SERVICE_URL)
    let result = await service.lookup()

    return handlerInput.responseBuilder
        .speak(result)
        .withSimpleCard('Membership Service Health Check', result)
        .getResponse();
  }
}

const ErrorHandler: ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
}

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    GetNginHealthHandler,
    GetMSHealthHandler,
    LaunchRequestHandler
)
  .addErrorHandlers(ErrorHandler)
  .lambda();