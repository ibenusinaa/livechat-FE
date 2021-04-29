import React from 'react'
import Chat from './Pages/Chat'
import Login from './Pages/Login'

// Socket.io
import socket from 'socket.io-client'
const io = socket('https://livechat-pwdk.herokuapp.com/')

class App extends React.Component{


  // componentDidMount(){
  //   let name = localStorage.getItem('name')
  //   let room = localStorage.getItem('room')

  //   this.setState({name: name, room: room})
  // }

  state = {
    name: null,
    room: null,
  }
  
  onChangeState = (name, room) => {
    this.setState({name: name, room: room})
    localStorage.setItem('name', name)
    localStorage.setItem('room', room)
  }

  render(){

    if(this.state.name === null){
      return(
        <Login io={io} onSubmit={this.onChangeState} />
      )
    }
    return (
        <Chat io={io} username={this.state.name} room={this.state.room} />
    )
  }
}

export default App;
