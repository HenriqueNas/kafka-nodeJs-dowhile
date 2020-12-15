import express, { json } from 'express'
import { Kafka } from 'kafkajs'
import { uuid } from 'uuidv4';

const app = express()

app.use(express.json())

const kafka = new Kafka({
  clientId: 'app',
  brokers: ['rocket',]
})


app.post('/order', async (request, response) => {
  const product = request.body
  product.id = uuid()
  product.status = 'PENDING_PAYMENT'

  const producer = kafka.producer()
  await producer.connect()

  await producer.send({
    topic: 'PENDENCIES',
    messages: [
      { value: JSON.stringify(product) },
    ],
  })

  await producer.disconnect()

  return response.json({ 'order': product })
});

app.listen(3333, () => console.log('app started \\o/'))