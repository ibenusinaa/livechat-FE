import React from 'react'

export class Login extends React.Component{


    onSubmit = () => {


        let name = this.name.value
        let room = this.room.value

        if(!name || !room) return alert('Masukkan nama dan room')

        this.props.io.emit('user-join', {name, room})
        this.props.io.on('total-user', (data) => {
            if(data < 4){
                this.props.onSubmit(name, room)
            }else{
                alert('Room Sudah Penuh!')
            }
        })
    }

    render() {
        return (
            <div className='container'>
                <div className='row justify-content-center m-5'>
                    <div className='row col-12 col-sm-12 col-md-6 col-lg-8 border rounded shadow p-5'>
                        <div className='text-center col-6'>
                            <h3>Livechat</h3>
                            <input type='text' ref={(el) => this.name = el} placeholder='Your Name' className='form-control mt-3' onKeyPress={(e) => {if(e.key === 'Enter'){this.onSubmit()}}}/>
                            <input type='text' ref={(el) => this.room = el} placeholder='Room Name' className='form-control mt-3' onKeyPress={(e) => {if(e.key === 'Enter'){this.onSubmit()}}}/>
                            <input type='button' value="let's chat" className='text-white w-100 btn mt-3' style={{backgroundColor: '#7f88d8'}} onClick={()=> this.onSubmit()}   />            
                        </div>
                        <div className='col-6'>
                            <img src="https://i.ibb.co/601Fqj3/undraw-Group-chat-re-frmo.png" alt="undraw-Group-chat-re-frmo" border="0" style={{width: '18rem', height: '13rem'}} />
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Login