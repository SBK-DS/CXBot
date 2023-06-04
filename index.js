const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('get called')
    res.json({ 'Worked': 'It worked' });
  });

  async function getShipmentDate(orderID) {
    try {
      const response = await axios.post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', {orderId: orderID});
      console.log(response.data);
      return response.data.shipmentDate;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


app.post('/', async (req, res) => {

  const intentName = req.body.queryResult.intent.displayName;;

  if (intentName === 'Welcome') {
    const fulfillmentText = "Hi, this is your CXBot. How can I help you?";
    return res.json({ fulfillmentText });
  }

  if (intentName === 'CheckOrderStatus') {

    const orderID = req.body.queryResult.parameters.orderID;
    const shipmentDate = await getShipmentDate(orderID)
    const humanReadableDate = moment(shipmentDate).format('dddd, DD MMM YYYY');

    const fulfillmentText = `Your order ${orderID} will be shipped on ${humanReadableDate}`;
    return res.json({ fulfillmentText });
  }

  if (intentName === 'ThankYou') {
    const audioUrl = 'https://drive.google.com/drive/folders/1AlkO7GyxX_b1w0i5gFvmdh5s0iY7pjad';
    const fulfillmentText = `<speak>You're welcome. <audio src="${audioUrl}"></audio></speak>`;
    return res.json({ fulfillmentText });
  }
});

app.listen(5000, (req, res) => {
  console.log('Webhook server is listening on port 5000');
});

