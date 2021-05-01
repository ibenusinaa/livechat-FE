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
            this.scrollToBottom()
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
            // this.setState({message: array})
            let userTyping = this.state.typing
            let index = null

            userTyping.forEach((value, idx) => {
                if(value.user === message.user){
                    index = idx
                }
            })

            if(index !== null){
                userTyping.splice(index, 1)
            }
            this.setState({message: array, typing: userTyping})
            this.scrollToBottom()
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
                    userTyping.splice(index, 1)
                    this.setState({typing: userTyping})
                }
                console.log(userTyping)
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
                        user: message.user,
                        message: message.user
                    })
                    console.log(userTyping)
                    this.setState({typing: userTyping})

                    this.scrollToBottom()
                }
            }
        })

        this.scrollToBottom()
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
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
        if(this.state.historyChat[0] === undefined){
            return(
                <div className="container">
                    <div className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
                        <div className='spinner-border text-info'>
                            
                        </div>
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>

                    </div>

                </div>
            )
        }

        return (
            <div className='container'>
                <div className='row justify-content-center my-3'>
                    <div className='col-12 col-sm-12 col-md-8 col-lg-6'>
                        <div className='border rounded-0 shadow' style={{height : "75vh", overflow: "auto", position: 'relative'}} >
                            <div className='bg-white p-3' style={{position: "sticky", top: "0px", right: "0px", left: "0px"}}>
                                <h6 className='mb-n1' style={{zIndex: 2}}>{this.props.room}</h6>
                                <span className='text-muted' style={{fontSize: 12, zIndex: 2}}>user online: 
                                    

                                    {
                                        this.state.userOnline?
                                            this.state.userOnline.map((value, index) => {
                                                if(index === this.state.userOnline.length - 1){
                                                    return(
                                                        <span key={index} className='text-muted ml-1' style={{fontSize: 12}}>
                                                            {value.name}
                                                        </span>
                                                    )
                                                }else{
                                                    return(
                                                        <span key={index} className='text-muted ml-1' style={{fontSize: 12}}>
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
                            <div className="alert alert-info rounded text-center mx-3 mt-3 mb-3"  style={{zIndex: -2}}>
                                Hello, {this.props.username? this.props.username : null}
                            </div>
                            {
                                this.state.historyChat[0]?
                                    this.state.historyChat[0].map((value, index) => {
                                        if(value.user === this.props.username){
                                            return(
                                                <div key={index} className="row justify-content-end align-items-end mx-1">
                                                    <div className='text-muted mr-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                    <div className="d-flex justify-content-end px-2 py-2 mx-3 mb-3 bg-primary rounded text-white" style={{display: "inline-block", maxWidth: '70%'}}>
                                                        {value.message}
                                                    </div>
                                                </div>
                                            )
                                        }else{
                                            return(
                                                <div key={index} className="row justify-content-start align-items-end mx-1">
                                                    <div className= 'col-12 text-muted' style={{zIndex: -2}}>
                                                        {value.user}
                                                    </div>
                                                    <div className="px-2 py-2 mx-3 mb-3 rounded" style={{display: "inline-block", backgroundColor: '#ededed', maxWidth: '70%'}}>
                                                        {value.message}
                                                    </div>
                                                    <div className='text-muted ml-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                </div>
                                            )
                                        }
                                    })
                                    
                                :
                                    null
                            }
                            {
                                this.state.historyChat[0].length === 0?
                                    null
                                :
                                    <>
                                        <div className='d-flex justify-content-center rounded mb-3' style={{fontStyle: 'italic', backgroundColor: '#ededed'}}>
                                            <span className='text-muted my-2'>earlier message</span>
                                        </div>
                                    </>
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
                                                    <div key={index} className="row justify-content-end align-items-end mx-1">
                                                        <div className='text-muted mr-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                        <div className="px-2 py-2 mx-3 mb-3 bg-primary rounded text-white" style={{display: "inline-block", maxWidth:'70%'}}>
                                                            {value.message}
                                                        </div>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div key={index} className="row justify-content-start align-items-end mx-1" style={{zIndex: -2}}>
                                                        <div className= 'col-12 text-muted'>
                                                            {value.user}
                                                        </div>
                                                        <div className="px-2 py-2 mx-3 mb-3 rounded" style={{display: "inline-block", backgroundColor: '#ededed', maxWidth:'70%'}}>
                                                            {value.message}
                                                        </div>
                                                        <div className='text-muted ml-1 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
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
                                        // if(value.user)
                                        return(
                                            <div key={index} className="row justify-content-start align-items-center mx-1">
                                                <div className="px-2 py-2 mx-3 mb-3 rounded" style={{display: "inline-block", backgroundColor: '#ededed', fontStyle: 'italic'}}>
                                                    {value.user} is typing....
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    
                                    null
                            }
                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </div>
                        
                        <div style={{height: '10vh'}} className='col-12 col-sm-12 col-md-12 col-lg-12 bg-white d-flex justfy-content-between border-bottom border-left border-right border-rounded shadow mb-3'>
                            <input type='text' placeholder='Type a message' ref={(e) => this.message = e} onChange={() => this.onTyping()} onKeyPress={(e) => {if(e.key === 'Enter'){this.onSendButton()}}} className='form form-control rounded w-100 mx-3 my-3'  />
                            <button className='btn btn-primary rounded-circle mr-3 my-3' value='Send' onClick= {() => this.onSendButton()} >
                                <FontAwesomeIcon icon ={faPaperPlane} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Chat