import React, { Component } from 'react';
import Clarifai from 'clarifai';
import './App.css';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: "5675b0b21b9f45eda84cc78380127fd1"
});

class App extends Component {

  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      boundingBox: {},
      route: 'signIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  onRouteChange = (route) => {
    if(route === 'signOut'){
      this.setState({ isSignedIn: false })
    } else if(route === 'home'){
      this.setState({ isSignedIn: true })
    }
    this.setState({route: route});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {
            entries: count
          }))
        });
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const inputImage = document.getElementById('inputimage');
    const imageHeight = Number(inputImage.height);
    const imageWidth = Number(inputImage.width);
    
    return {
      leftCol: clarifaiFace.left_col * imageWidth,
      topRow: clarifaiFace.top_row * imageHeight,
      rightCol: imageWidth - (clarifaiFace.right_col * imageWidth),
      bottomRow: imageHeight - (clarifaiFace.bottom_row * imageHeight)
    }
  }

  displayFaceBox = (boxData) => {
    this.setState({ boundingBox: boxData })
  }

  render() {
    const { isSignedIn, route, boundingBox, imageUrl } = this.state;
    return (
      <div className="App">
        {/* <ParticlesBackground /> */}
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        { route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
            
            <p>https://samples.clarifai.com/face-det.jpg</p>

            <FaceRecognition boundingBox={boundingBox} imageUrl={imageUrl} />
          </div>
        : (
          route === 'signIn' ?
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          :
            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )}
      </div>
    );
  }
}

export default App;


