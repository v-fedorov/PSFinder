import * as moment from "moment";

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendIsAvailableTextAsync = async (text: string) => {
  var now = moment().format("MMM DD h:mm A");
  const body = `${now}: ${text}`;

  // Send text
  await client.messages.create({
    body,
    from: process.env.FROM_PHONE_NUMBER,
    to: process.env.TO_PHONE_NUMBER,
  });
};

const callPhoneAsync = (text: string): Promise<void> =>
  client.calls
    .create({
      twiml: `<Response><Say>${text}</Say></Response>`,
      from: process.env.FROM_PHONE_NUMBER,
      to: process.env.TO_PHONE_NUMBER,
    })
    .then((call) => console.log(call.sid));

export { sendIsAvailableTextAsync, callPhoneAsync };
