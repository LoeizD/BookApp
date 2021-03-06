const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
var paypal = require('paypal-rest-sdk')

mongoose.connect(process.env.MLAB_URI)

const Payment = mongoose.model('Payment', {
  paymentId: { type: String, required: true, unique: true },
  payerId: { type: String, required: true },
  date: { type: Date, required: true }
})

const Word = mongoose.model('Word', {
  word: { type: String, required: true },
  locked: { type: Boolean, default: true, required: true },
  index: { type: Number, required: true, unique: true }
})

app.use(cors())

paypal.configure({
  'mode': 'sandbox', // sandbox or live
  'client_id': 'AWoS4yN6yYMUsoEbEUzByupO7BnpmInaji1xX-9F9rVTmaDZMDzw88GhkQU2flGW-uylk5eZrOTT2Hd8',
  'client_secret': 'EOC4wEiy1Hu8qnrgLcD1uqBExnUYcB5mcTDHG5cUiq0rviAQ3QpipPHs6_YI1bkuAlRmkCJRnhYolTBu'
})

app.post('/pay', (req, res) => {
  const createPaymentJson = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      'return_url': 'http://51.15.205.111:6600/success',
      'cancel_url': 'http://51.15.205.111/index.html'
    },
    'transactions': [{
      'item_list': {
        'items': [{
          'name': 'word',
          'sku': '001',
          'price': '2.00',
          'currency': 'USD',
          'quantity': 1
        }]
      },
      'amount': {
        'currency': 'USD',
        'total': '2.00'
      },
      'description': 'Unlock the next mysterious word!'
    }]
  }

  paypal.payment.create(createPaymentJson, function (error, payment) {
    if (error) {
      throw error
    } else {
      /*
            console.log("Create Payment Response")
            console.log(payment)
            res.send('test')
            */
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href)
        }
      }
    }
  })
})

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId

  const executePaymentJson = {
    'payer_id': payerId,
    'transactions': [{
      'amount': {
        'currency': 'USD',
        'total': '2.00'
      }
    }]
  }

  paypal.payment.execute(paymentId, executePaymentJson, function (error, payment) {
    if (error) {
      console.log(error.response)
      throw error
    } else {
      // add payment to payment collection (list of all successful payments)
      // redirect to index.html

      Payment.create({ paymentId: paymentId, payerId: payerId, date: Date.now() }, (err, data) => {
        if (err) {
          console.log(err)
          return err
        }
        console.log('Success adding payment to DB')
      })
      res.redirect('http://51.15.205.111/?newword')
      // console.log(JSON.stringify(payment));
      // res.send('Success');
    }
  })
})

app.get('/products/:id', function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for all origins!' })
})

app.get('/api/words/', (req, res) => {
  // all unlocked words
  Payment.countDocuments((err, count) => {
    if (err) {
      console.log(err)
      return err
    }
    const unlocked = count * 6
    // find, sort
    Word.find({ index: { $lte: unlocked } }).sort({ index: 'asc' }).exec((err, data) => {
      if (err) {
        console.log(err)
        return err
      }
      res.json(data)
    })
  })

  // res.json({error: "error"})
})

app.listen(6600, function () {
  console.log('CORS-enabled web server listening on port 6600')
})
