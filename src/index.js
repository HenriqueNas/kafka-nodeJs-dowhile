import express, { json } from 'express'
import { Kafka } from 'kafkajs'

const app = express()

app.use(express.json())

const kafka = new Kafka({
  clientId: 'app',
  brokers: ['rocket',]
})

const producer = kafka.producer()

app.post('/order', (request, response) => {
  const prod = request.body;
  await producer.connect()

  await producer.send({
    topic: 'PRODUTO_COMPRADO',
    messages: [
      { value: JSON.stringify(prod) },
    ],
  })

  await producer.disconnect()

  return response.json({ 'order': prod });
});

app.listen(3333)