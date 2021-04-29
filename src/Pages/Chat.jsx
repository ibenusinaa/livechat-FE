import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export class Chat extends React.Component {

    state = {
        userOnline: [],
        message: [],
        historyChat: [],
        typing: []
    }

    componentDidMount(){
        this.props.io.on('user-online', (data) => {
            console.log(data)
            this.setState({userOnline: data})
        })

        this.props.io.on('history', (data) => {
            console.log(data)
            let arrMessage = this.state.historyChat
            arrMessage.push(data)
            console.log(arrMessage)
            this.setState({historyChat: arrMessage})
        })

        this.props.io.on('send-message-from-server', (data) => {
            let arrMessage = this.state.message
            arrMessage.push(data)
            this.setState({message: arrMessage})
        })

        this.props.io.on('send-message-back', (message) => {
            console.log(message)
            let array = this.state.message
            array.push(message)
            this.setState({message: array, typing: []})
        })

        this.props.io.on('typing-back', (message) => {
            if(message.message.length === 0){
                let userTyping = this.state.typing
                let index = null

                userTyping.forEach((value, idx) => {
                    if(value.user === message.user){
                        index = idx
                    }
                })

                if(index !== null){
                    userTyping.push(index, 1)
                    console.log(userTyping)
                    this.setState({typing: userTyping})
                }
            }else{
                let userTyping = this.state.typing
                let index = null

                userTyping.forEach((value, idx) => {
                    if(value.user === message.user){
                        index = idx
                    }
                })

                if(index === null){
                    userTyping.push({
                        user: message.user
                    })
                    console.log(userTyping)
                    this.setState({typing: userTyping})
                }
            }
        })

 
    }

    onSendButton = () => {
        let message = {
            user: this.props.username,
            message: this.message.value
        }
        
        console.log(message)

        // this.props.io.emit('typing', messageTyping)
        this.props.io.emit('send-message', message)
        this.message.value = ''
    }

    onTyping = () => {
        let message = {
            user: this.props.username,
            message: this.message.value
        }

        this.props.io.emit('typing', message)
    }

    render() {
        return (
            <div className='container'>
                <div className='row justify-content-center mt-3'>
                    <div className='col-6'>
                        <div className='border rounded-0 shadow' style={{height : "630px", overflow: "auto", position: "relative"}} >
                            <div className='bg-white p-3' style={{position: "sticky", top: "0px", right: "0px", left: "0px"}}>
                                <h6 className='mb-n1'>{this.props.room}</h6>
                                <span className='text-muted' style={{fontSize: 12}}>user online: 
                                    

                                    {
                                        this.state.userOnline?
                                            this.state.userOnline.map((value, index) => {
                                                if(index === this.state.userOnline.length - 1){
                                                    return(
                                                        <span className='text-muted ml-1' style={{fontSize: 12}}>
                                                            {value.name}
                                                        </span>
                                                    )
                                                }else{
                                                    return(
                                                        <span className='text-muted ml-1' style={{fontSize: 12}}>
                                                            {value.name},
                                                        </span>
                                                    )
                                                }
                                            })
                                        :
                                            null
                                    } 
                                    
                                </span>
                            </div>
                            <div className="alert alert-warning rounded-0 text-center mx-3 mt-3 mb-5" >
                                Hello, {this.props.username? this.props.username : null}
                            </div>
                            {
                                this.state.historyChat[0]?
                                    this.state.historyChat[0].map((value, index) => {
                                        if(value.user === this.props.username){
                                            return(
                                                <div className="row justify-content-end align-items-center mx-1">
                                                    <span className='text-muted mr-n2' style={{fontSize: 12}}>{(value.created_at).split(',')[1]}</span>
                                                    <div className="px-2 py-2 mx-3 mb-3 bg-primary rounded text-white" style={{display: "inline-block"}}>
                                                        {value.message}
                                                    </div>
                                                </div>
                                            )
                                        }else{
                                            return(
                                                <div className="row justify-content-start align-items-center mx-1">
                                                    <div className= 'col-12 text-muted'>
                                                        {value.user}
                                                    </div>
                                                    <div className="px-2 py-2 mx-3 mb-3 rounded" style={{display: "inline-block", backgroundColor: '#ededed'}}>
                                                        {value.message}
                                                    </div>
                                                    <span className='text-muted ml-n2' style={{fontSize: 12}}>{(value.created_at).split(',')[1]}</span>
                                                </div>
                                            )
                                        }
                                    })
                                :
                                    null
                            }
 
                            {
                                this.state.message?
                                    this.state.message.map((value, index) => {
                                        if(value.from === 'Bot'){
                                            return(
                                                <div key={index} className="alert alert-warning rounded-0 text-center mx-3 mt-3 mb-5" >
                                                    <span className="font-weight-bold mr-1">{value.from}</span><span>{value.message}</span>
                                                </div>
                                            )
                                        }else{
                                            if(value.user === this.props.username){
                                                return(
                                                    <div className="row justify-content-end align-items-center mx-1">
                                                        <span className='text-muted mr-n2' style={{fontSize: 12}}>{(value.created_at).split(',')[1]}</span>
                                                        <div className="px-2 py-2 mx-3 mb-3 bg-primary rounded text-white" style={{display: "inline-block"}}>
                                                            {value.message}
                                                        </div>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div className="row justify-content-start align-items-center mx-1">
                                                        <div className= 'col-12 text-muted'>
                                                            {value.user}
                                                        </div>
                                                        <div className="px-2 py-2 mx-3 mb-3 rounded" style={{display: "inline-block", backgroundColor: '#ededed'}}>
                                                            {value.message}
                                                        </div>
                                                        <span className='text-muted ml-1' style={{fontSize: 12}}>{(value.created_at).split(',')[1]}</span>
                                                    </div>
                                                )
                                            }
                                        }
                                    })
                                :
                                    null
                            }
                            {
                                this.state.typing?
                                    this.state.typing.map((value, index) => {
                                        return(
                                            <div className="row justify-content-start align-items-center mx-1">
                                                <div className="px-2 py-2 mx-3 mb-3 rounded" style={{display: "inline-block", backgroundColor: '#ededed', fontStyle: 'italic'}}>
                                                    {value.user} is typing....
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    
                                    null
                            }
                            <div style={{position: "fixed", left: "498px", bottom: "0px", right: "498px"}} className='bg-white d-flex justfy-content-between border-bottom border-left border-right border-rounded shadow mb-3'>
                                <input type='text' placeholder='Type your message...' ref={(e) => this.message = e} onChange={() => this.onTyping()} className='form-control rounded-0 w-100 mx-3 my-3'  />
                                <button className='btn btn-primary rounded-circle mr-3 my-3' value='Send' onClick= {() => this.onSendButton()} >
                                    <FontAwesomeIcon icon ={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
// enterTrigger = (e) => {
//     e.preventDefault();

//     console.log('Bebas')
// }

// <form onSubmit={this.onFormSubmit}>
//                                     <input type='text' />
//                                     <button type="submit" onClick={this.enterTrigger}>Submit</button>
//                                 </form>


export default Chat