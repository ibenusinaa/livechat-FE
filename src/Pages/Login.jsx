import React from 'react'

export class Login extends React.Component{


    onSubmit = () => {
        let name = this.name.value
        let room = this.room.value

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
                    <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                        <div className='border rounded shadow p-5 text-center'>
                            <h3>Livechat</h3>
                            <input type='text' ref={(el) => this.name = el} placeholder='Your Name' className='form-control mt-3'/>
                            <input type='text' ref={(el) => this.room = el} placeholder='Room Name' className='form-control mt-3'/>
                            <input onClick={() => this.onSubmit()} type='button' value='Submit' className='w-100 btn btn-info mt-3'  />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login