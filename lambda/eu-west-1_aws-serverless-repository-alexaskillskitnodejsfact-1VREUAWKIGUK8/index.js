/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const SKILL_NAME = 'Mucca parlante';
const GET_FACT_MESSAGE = 'La mucca dice: ';
const HELP_MESSAGE = 'Chiedimi cosa dice la mucca';
const HELP_REPROMPT = 'Come posso aiutarti?';
const STOP_MESSAGE = 'A presto!';

const data = [
  'una mucca può produrre fino a 80 litri di latte al giorno',
  'una mucca adulta può arrivare a pesare fino a 1100kg',
  'le mucche possono vivere fino a 20 anni'
];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Benvenuto sull \'Alexa skills kit, chiedimi qualcosa sulle mucche!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

function randomElement(myArray) { 
    return(myArray[Math.floor(Math.random() * myArray.length)]); 
}

const CowsayIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'CowsayIntent';
  },
  
  handle(handlerInput) {
	const speechOutput = 'Ecco qualcosa che non sai sulle mucche:' + randomElement(data);

	// device has display	
	if (supportsDisplay(handlerInput) ) {
    const myImage = new Alexa.ImageHelper()
      .addImageInstance('https://s3-eu-west-1.amazonaws.com/alexa-pictures/cow1_large.jpg')
      .getImage();

    const primaryText = new Alexa.RichTextContentHelper()
      .withPrimaryText(speechOutput)
      .getTextContent();

      handlerInput.responseBuilder.addRenderTemplateDirective({
        type: 'BodyTemplate1',
        token: 'string',
        backButton: 'HIDDEN',
        backgroundImage: myImage,
        title: "Cowsay",
        textContent: primaryText,
      });

}
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(speechOutput)
      .getResponse();
  },	

};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('Scusa, qualcosa è andato storto')
      .reprompt('Scusa, qualcosa è andato storto')
      .getResponse();
  },
};


// returns true if the skill is running on a device with a display 
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    CowsayIntentHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
