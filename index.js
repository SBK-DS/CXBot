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
  console.log('post called')
  const intentName = req.body.queryResult.intent.displayName;;

  console.log(intentName)

  if (intentName === 'Welcome') {
    const fulfillmentText = "Hi, this is your CXBot. How can I help you?";
    console.log('Intent Welcome called')
    return res.json({ fulfillmentText });
  }

  if (intentName === 'CheckOrderStatus') {
    console.log('Intent OrderId')
    const orderID = req.body.queryResult.parameters.orderID;
    console.log(orderID)

    // Call a function or API to retrieve the order status based on the orderID
    // console.log('shipment function', await getShipmentDate(orderID))
    const shipmentDate = await getShipmentDate(orderID)
    const humanReadableDate = moment(shipmentDate).format('dddd, DD MMM YYYY');
    console.log('shipment date is', shipmentDate)

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


// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const dailogflow = require('dialogflow')
// const { WebhookClient } = require('dialogflow-fulfillment')

// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   console.log('get called')
//     res.json({ 'Worked': 'It worked' });
//   });

// app.post('/webhook', express.json(), (req, res) => {
  
//   console.log('webhook called')
//   const _agent = new WebhookClient({request: req, response: res})

//   //welcome

//   function welcome(agent) {
//     agent.add(`Hi this is your CXBot. How can I help `)
//   }

//   const intentMap = new Map()
//   intentMap.set('Default Welcome Intent', demo)
//   _agent.handleRequest(intentMap)


//   //check order

//   function checkOrder(agent) {
//     agent.add(`What is your orderID`)
//   }

//   const intentMap = new Map()
//   intentMap.set('Default Welcome Intent', demo)
//   _agent.handleRequest(intentMap)


// })

// app.listen(5000, (req, res) => {
//   console.log('Webhook server is listening on port 5000');
// });

