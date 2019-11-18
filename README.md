# Face recognition app with Azure

## App overview

We will be creating a face recognition app. It will have both server (Node.js) and client-side (react.js) components.

The server is responsible for registering the faces with Microsoft Cognitive Services’ Face API.

On the other hand, the app is responsible for the following:
- Upload a URL from an image on JPG format.
- Show the attributes of the image, in this case: gender and age.

[Here is the link of the code](https://github.com/D4v1d98Ru1z/faceRecognition)


Here’s what the app will look like:

![App](https://media.giphy.com/media/j44fDoSF7MFDs4vByF/giphy.gif)

## What is Cognitive Services?

Before we proceed, let's first quickly go over what Cognitive Services is. Cognitive Services is a collection of services that allow developers to easily implement machine learning features to their applications. These services are available via an API which is grouped under the following categories:

- Vision - for analyzing images and videos.
- Speech - for converting speech to text and vise-versa.
- Language - for processing natural language.
- Decision - for content moderation.
- Search - for implementing search algorithms that are used on Bing.

Today we're only concerned about Vision, more specifically the Face API. This API is used for identifying and finding similarities of faces in an image.

## Setting up Cognitive Services

In this section, we’ll be setting up Cognitive services in the Azure portal. This section assumes that you already have an Azure account.

First, go to the Azure portal and search for “Cognitive services”. Click on the first result under the Services:

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/0mcd4z2ennnm7n1vlkir.png)

Next, search for “face” and click on the first result:


![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/1.png)

On the page that follows, click on the Create button to add the service:

![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/2.png)

After that, it will ask for the details of the service you want to create.

![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/3.png)

Enter the details of the resource group you want to add the service too. In this case, I simply put in the name then click OK:

![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/4.png)

Once the resource group is created, you can now add the cognitive service. Here’s what it looks like as it’s deploying:

![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/5.png)

Once it’s created, you’ll find it listed under the Cognitive Services:

![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/6.png)

If you click on it, you’ll see the overview page. Click on the Show access keys link to see the API keys that you can use to make requests to the API. At the bottom, you can also see the number of API calls that you have made and the total allotted to the pricing tier you chose:

![image](https://raw.githubusercontent.com/D4v1d98Ru1z/faceRecognition/master/article-assets/7.png)

## Build the app

Now we’re ready to start building the app. We’ll first start with the server component.

### Server 

The server is where we are going to do all the connections with the Face API. 

> Note: This is going to be an easy example of getting all the information. You can scale the API as you wish.

Start by importing all the modules we need:

```javascript

const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const app = express()

```
Next, create the base variable to be used for initializing an Axios instance. We will use this, later on, to make a request to the API. You need to supply a different URL based on your location. You can find the list of locations [here](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b). The API key (Ocp-Apim-Subscription-Key) is passed as a header value along with the Content-Type:

``` javascript
// API key from Azure
const ApiKey = `YOUR COGNITIVE SERVICES API KEY`
// Azure endpoint URL - Face API
const AzureEndpoint = `https://westus.api.cognitive.microsoft.com/face/v1.0` // replace with the server nearest to you

// Base instance for axios request
const baseInstanceOptions = {
  baseURL: AzureEndpoint,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': ApiKey
  }
}
```

Next, add the route for creating a face list. This requires the URL of the image that is going to be passed from the request body. This URL must have a JPG format.

```javascript
app.post('/create-facelist', async (req, res) => {
  try {
    const instanceOptions = {...baseInstanceOptions}
    const instance = axios.create(instanceOptions)
    const body = req.body

    // URL with all the params for Azure
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
```

### Web app

Now we can proceed to code the app. Start by creating the project with npx: `npx create-react-app face-recognition-app`

Let's get an overview of the frontend. As I mentioned before it's a very simple example so it will consist of just an input that sends the data to the API.

Now we can proceed to define the states of the app like this: 

```javascript
// Api endpoint
const URLAPI = `http://localhost:5000`

// hook state to get the data from the API 
const [data, setData] = useState([])
// Hook state to get the info from the input
const [image, setImage] = useState('https://www.kienyke.com/wp-content/uploads/2018/10/selfie.jpg')
```

When the user enters a value in the input is going to be set on the state:

```javascript
// Set the state with the input value
const handleOnChange = event => {
  setImage(event.target.value)
}
```

Next, with the value of the input let proceed to fetch the data:

```javascript
const handleClickImage = async event => {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: image,
      })
   }

  // Fetch the data
  const resp = await fetch(`${URLAPI}/create-facelist`, fetchOptions)
    const people = await resp.json()
    console.log(people.data)
    // Set the state of the data
    setData(people.data)
  } catch (err) {
    console.error(err)
  }
}

```
Next, update the render content to look like the following:

``` javascript
return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Upload a JPG image
        </p>
        <div className="containerFile">
          <input
            className="inputFile"
            placeholder="Upload image"
            onChange={handleOnChange}
            value={image}
          />
          <button
            className="buttonFile"
            onClick={handleClickImage}
          >
            Upload
          </button>
        </div>
        <h3 className="titleAtribute">Image attributes: </h3>
        <ul>
        {
          data.map(item => (
            <li key={item.faceId}>
              <span>
                Gender: {item.faceAttributes.gender}, age: {item.faceAttributes.age}
              </span>
            </li>
          ))
        }
        </ul>
        <img
          src={image}
          width={220}
          height={180}
          alt={image}
        />
        <a
          className="App-link"
          href={image}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link of the image: {image}
        </a>
      </header>
    </div>
  );
```

In the code above, all we’re doing is adding the input and an unordered list that will render the attributes from the pictured analyzed.

## Running the app

At this point you’re now ready to run the app:

``` bash 
# run API
npm run start

# run web app
cd web/face-detect-app
npm run start

```

## Conclusion

In this tutorial, you learned how to use Microsoft Cognitive Services to create a face recognition app that uses facial recognition to identify people.
