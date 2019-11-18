const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const app = express()

// API key from Azure
const ApiKey = `15c2a09521ed43ee977aac9c15df3ec0`
// Azure endpoint URL - Face API
const AzureEndpoint = `https://westus.api.cognitive.microsoft.com/face/v1.0`

// Base instance for axios request
const baseInstanceOptions = {
  baseURL: AzureEndpoint,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': ApiKey
  }
}

// body Parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Allow cors middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()

  app.options('*', (res, req) => {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS')
  })
})

app.post('/create-facelist', async (req, res) => {
  try {
    const instanceOptions = {...baseInstanceOptions}
    const instance = axios.create(instanceOptions)
    const body = req.body

    const response = await instance.post(
      `/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_01&returnRecognitionModel=false&detectionModel=detection_01&returnFaceAttributes=age,gender`,
      {
        url: body.image
      }
    )

    // send the response of the fetch
    res.send({
      response: 'ok',
      data: response.data
    })
  } catch (err) {
    console.log("error :c : ", err)
    res.send({response: 'not ok'})
  }
})


// Create server
const PORT = 5000
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on ports ${PORT}`)
  }
})