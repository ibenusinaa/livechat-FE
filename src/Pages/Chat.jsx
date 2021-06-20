import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPaperPlane, faReply } from '@fortawesome/free-solid-svg-icons'

export class Chat extends React.Component {

    state = {
        userOnline: [],
        message: [],
        historyChat: [],
        typing: [],
        charType : 0,
        reply: {
            user: null,
            message: null
        }
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

        if(this.state.charType > 255) return

        this.setState({reply: {user: null, message: null}, charType: 0})
        let message
        if(this.message.value && this.state.reply.user) {
            message = {
                user: this.props.username,
                message: this.message.value,
                replied_user: this.state.reply.user,
                replied_message: this.state.reply.message
            }
        }else if(this.message.value) {
            message = {
                user: this.props.username,
                message: this.message.value
            }
        }else{
            alert("message can't be empty")
        }
        
        console.log(message)

        // this.props.io.emit('typing', messageTyping)
        this.props.io.emit('send-message', message)
        this.message.value = ''
    }

    onTyping = () => {

        if(this.message.value.length >= 235) {
            this.setState({charType: this.message.value.length})
        }

        if(this.message.value.length < 235) {
            this.setState({charType: null})
        }

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
                    <div className='col-12 col-sm-12 col-md-8 col-lg-7'>
                        <div className='border rounded-0 shadow'>
                            <div className='bg-white p-3' style={{position: "sticky", top: "0px", right: "0px", left: "0px", borderBottom: '1px solid transparent'}}>
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
                            <div className='shadow' style={{height : "75vh", overflow: "auto", position: 'relative', scrollBehavior: 'smooth'}} >
                            <div className="welcome-notification">
                                Hello, {this.props.username? this.props.username : null}
                            </div>
                            

                            {/* codingan buat history chat */}
                            {
                                this.state.historyChat[0]?
                                    this.state.historyChat[0].map((value, index) => {

                                        // chat history dari kita sendiri
                                        if(value.user === this.props.username){
                                            return(
            
                                                value.replied_user?
                                                // kalo reply orangg lain
                                                    <div key={index} className="row justify-content-end align-items-end mx-1">
                                                        <div className='text-muted mr-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                        <div className="my-chat" 
                                                            >
                                                                <a href = {`#${value.replied_user}${value.replied_message}`}>
                                                                    <div className='user-replied-me'>{value.replied_user}</div>
                                                                    <div className='message-replied-me'>
                                                                    {
                                                                        value.replied_message.length > 80?
                                                                            value.replied_message.slice(0, 80) + '...'
                                                                        :
                                                                            value.replied_message
                                                                    }
                                                                    </div>
                                                                </a>
                                                                <div id={value.replied_user + value.replied_message} className="row justify-content-between px-3" style={{marginTop: '.5rem', position: 'relative'}}
                                                                    onClick={()=> this.setState({reply: {user: this.props.username, message: value.message}})}>
                                                                    <div className='message-font'>
                                                                        {value.message} 
                                                                    </div>
                                                                    <div>
                                                                        <FontAwesomeIcon icon ={faReply} size='1x' className='reply-me'/>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                :
                                                // kalo ga reply
                                                    <div id={value.user + value.message} key={index} className="row justify-content-end align-items-end mx-1">
                                                        <div className='text-muted mr-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                        <div className="d-flex justify-content-end my-chat" 
                                                            onClick={()=> this.setState({reply: {user: this.props.username, message: value.message}})}>
                                                            <div className='message-font'>
                                                                {value.message} 
                                                            </div>
                                                            <div>
                                                                <FontAwesomeIcon icon ={faReply} size='1x' className='reply-me' style={{top: '1rem', right: '.5rem'}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                            )
                                        }else{
                                            // chat history dari orang lain
                                            return(
                                                value.replied_user?
                                                    <div key={index} className="row justify-content-start align-items-end mx-1" style={{cursor: 'pointer'}} 
                                                        >
                                                        <div className= 'col-12 mb-1' style={{fontSize: '.8rem'}}>
                                                            {value.user}
                                                        </div>
                                                        <div className="friends-chat">
                                                            <a href = {`#${value.replied_user}${value.replied_message}`}>
                                                                    <div className='user-replied'>{value.replied_user}</div>
                                                                    <div className='message-replied'>
                                                                    {
                                                                        value.replied_message.length > 80?
                                                                            value.replied_message.slice(0, 80) + '...'
                                                                        :
                                                                            value.replied_message
                                                                    }
                                                                    </div>
                                                            </a>
                                                            <div id={value.replied_user + value.replied_message} className="row justify-content-between px-3" 
                                                                onClick={()=> this.setState({reply: {user: value.user, message: value.message}})} 
                                                                style={{marginTop: '.85rem', position: 'relative'}}>
                                                                <div className='message-font'>
                                                                    {value.message} 
                                                                </div>
                                                                <div>
                                                                    <FontAwesomeIcon icon ={faReply} size='1x' className='reply-friends' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='text-muted ml-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                    </div>
                                                :
                                                    <div id={value.user + value.message} key={index} className="row justify-content-start align-items-end mx-1" style={{cursor: 'pointer'}} 
                                                        onClick={()=> this.setState({reply: {user: value.user, message: value.message}})}>
                                                        <div className= 'col-12 mb-1' style={{fontSize: '.8rem'}}>
                                                            {value.user}
                                                        </div>
                                                        <div className="d-flex justify-content-end friends-chat">
                                                            <div className='message-font'>
                                                                {value.message} 
                                                            </div>
                                                            <div>
                                                                <FontAwesomeIcon icon ={faReply} size='1x' className='reply-friends' style={{top: '1rem', right: '.5rem'}}/>
                                                            </div>
                                                        </div>
                                                        <div className='text-muted ml-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                    </div>
                                            )
                                        }
                                    })
                                    
                                :
                                    null
                            }

                            {/* buat earliermessage */}
                            {
                                this.state.historyChat[0].length === 0?
                                    null
                                :
                                    <>
                                        <div className='d-flex justify-content-center rounded mb-3' style={{fontStyle: 'italic', backgroundColor: '#f4f7f7'}}>
                                            <span className='text-muted my-2'>earlier message</span>
                                        </div>
                                    </>

                            }
                            {/* buat message masuk */}
                            {
                                this.state.message?
                                    this.state.message.map((value, index) => {
                                        // kalau dari bot
                                        if(value.from === 'Bot'){
                                            return(
                                                <div key={index} className="welcome-notification" >
                                                    <span className="font-weight-bold mr-1">{value.from}</span><span>{value.message}</span>
                                                </div>
                                            )
                                        }else{

                                            // kalau dari diri sendiri
                                            if(value.user === this.props.username){
                                                return(
                                                    value.replied_user?

                                                        // kalau kita ngereply seseorang
                                                        <div key={index} className="row justify-content-end align-items-end mx-1">
                                                            <div className='text-muted mr-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                            <div className="my-chat" 
                                                                >
                                                                <a href = {`#${value.replied_user}${value.replied_message}`}>
                                                                    <div className='user-replied-me'>{value.replied_user}</div>
                                                                    <div className='message-replied-me'>
                                                                    {
                                                                        value.replied_message.length > 80?
                                                                            value.replied_message.slice(0, 80) + '...'
                                                                        :
                                                                            value.replied_message
                                                                    }
                                                                    </div>
                                                                </a>
                                                                <div className="row justify-content-between px-3"
                                                                    onClick={()=> this.setState({reply: {user: this.props.username, message: value.message}})} style={{marginTop: '.85rem', position: 'relative'}}>
                                                                    <div className='message-font'>
                                                                        {value.message} 
                                                                    </div>
                                                                    <div>
                                                                        <FontAwesomeIcon icon ={faReply} size='1x' className='reply-me'/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    :
                                                        // kalau diri sendiri ga ada ngereply siapa siapa
                                                        <div id={value.user + value.message} key={index} className="row justify-content-end align-items-end mx-1">
                                                            <div className='text-muted mr-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                            <div className="d-flex justify-content-end my-chat" 
                                                                onClick={()=> this.setState({reply: {user: this.props.username, message: value.message}})}>
                                                                <div className='message-font'>
                                                                    {value.message} 
                                                                </div>
                                                                <div>
                                                                    <FontAwesomeIcon icon ={faReply} size='1x' className='reply-me' style={{top: '1rem', right: '.5rem'}}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                )
                                            }else{

                                                // kalau dari orang lain
                                                return(
                                                    value.replied_user?
                                                    <div key={index} className="row justify-content-start align-items-end mx-1" style={{cursor: 'pointer'}} 
                                                        >
                                                        <div className= 'col-12 mb-1' style={{fontSize: '.8rem'}}>
                                                            {value.user}
                                                        </div>
                                                        <div className="friends-chat">
                                                            <a href = {`#${value.replied_user}${value.replied_message}`}>
                                                                <div className='user-replied'>{value.replied_user}</div>
                                                                <div className='message-replied'>
                                                                {
                                                                    value.replied_message.length > 80?
                                                                        value.replied_message.slice(0, 80) + '...'
                                                                    :
                                                                        value.replied_message
                                                                }
                                                                </div>
                                                            </a>
                                                            <div id={value.replied_user + value.replied_message} className="row justify-content-between px-3" 
                                                                onClick={()=> this.setState({reply: {user: value.user, message: value.message}})}style={{marginTop: '.85rem', position: 'relative'}}>
                                                                <div className='message-font'>
                                                                    {value.message} 
                                                                </div>
                                                                <div>
                                                                    <FontAwesomeIcon icon ={faReply} size='1x' className='reply-friends'/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='text-muted ml-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
                                                    </div>
                                                :
                                                    <div id={value.user + value.message} key={index} className="row justify-content-start align-items-end mx-1" style={{cursor: 'pointer'}} 
                                                        onClick={()=> this.setState({reply: {user: value.user, message: value.message}})}>
                                                        <div className= 'col-12 mb-1' style={{zIndex: -2, fontSize: '.8rem'}}>
                                                            {value.user}
                                                        </div>
                                                        <div className="d-flex justify-content-end friends-chat">
                                                            <div className='message-font'>
                                                                {value.message} 
                                                            </div>
                                                            <div>
                                                                <FontAwesomeIcon icon ={faReply} size='1x' className='reply-friends' style={{top: '1rem', right: '.5rem'}}/>
                                                            </div>
                                                        </div>       
                                                        <div className='text-muted ml-n2 mb-3' style={{fontSize: 12}}>{(value.created_at).split(' ')[1].slice(0, 5)}</div>
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
                                                <div className="friends-chat" style={{display: "inline-block", backgroundColor: '#ededed', fontStyle: 'italic'}}>
                                                    {value.user} is typing....
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    
                                    null
                            }
                            {/* code biar auto scroll */}
                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                            </div>

                        </div>
                        <div className='col-12 col-sm-12 col-md-12 col-lg-12 bg-white d-flex justfy-content-between border-bottom border-left border-right border-rounded shadow mb-3' style={{position: 'relative'}}>
                            {
                                this.state.charType?

                                    this.state.charType > 255?
                                        <div className='char_notification_red'>
                                            your message has {this.state.charType} characters. (maximum character is 255)
                                        </div>

                                    :
                                    
                                        <div className='char_notification'>
                                            {255 - this.state.charType} characters left. (maximum character is 255)
                                        </div>
                                :
                                    null
                            }
                            {
                                this.state.reply.user?

                                    <div className='popup-reply-message'>
                                        <span style={{fontWeight: 700}}>{this.state.reply.user}</span>
                                        <span style={{fontSize: '.8rem'}}>
                                        {
                                            this.state.reply.message.length > 68?
                                                this.state.reply.message.slice(0, 68) + '...'
                                            :
                                                this.state.reply.message
                                        }
                                        </span>
                                        <span onClick={() => this.setState({reply: {user: null, message: null}})} className='close-button'>x</span>
                                    </div>
                                :
                                    null
                            }
                            <input type='text' placeholder='Type a message' ref={(e) => this.message = e} onChange={() => this.onTyping()} onKeyPress={(e) => {if(e.key === 'Enter'){this.onSendButton()}}} className='chat-input'  />
                            <button disabled={this.state.charType > 255} className='btn rounded-circle mr-3 my-3' value='Send' onClick= {() => this.onSendButton()} >
                                <FontAwesomeIcon icon ={faPaperPlane} className='send-button'/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Chat