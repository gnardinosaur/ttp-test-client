import React from 'react';
import { Container, Button, Form, Divider, Segment, Message } from 'semantic-ui-react';

class Register extends React.Component {

  state = {
    user: {
      name: '',
      email: '',
      password: ''
    },
    error: false,
    messages: []
  }

  handleChange = (e) => {
    this.setState({ 
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value,
      },
      error: false
    })
  };

  createUser = () => {
    fetch('https://ttp-test-api.herokuapp.com/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user: this.state.user
      })
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.status === 'OK') {
        //set user in App's state
        this.props.setUser(data.user)
        //redirect to Portfolio page
        this.props.history.push('/portfolio')
      } else {
        //render error message(s)
        this.setState({ 
          error: true,
          messages: data.messages
         })
      }
    })
  }

  render(){
    let messages;
    
    if(this.state.error){
      messages = this.state.messages.map(el => <li>{el}</li>)
    };

    return (
      <Container className='welcome-container'>
        <Segment placeholder>
          <h1>Register</h1>
          <br />
          <Form error={this.state.error} onSubmit={this.createUser}>
            <Form.Field onChange={this.handleChange}>
              <input name='name' placeholder='name...' />
            </Form.Field>
            <Form.Field onChange={this.handleChange}>
              <input name='email' placeholder='email...' />
            </Form.Field>
            <Form.Field onChange={this.handleChange}>
              <input name='password' type='password' placeholder='password...' />
            </Form.Field>
            <Button type='submit'>Register</Button>
            {/* error messages */}
            <Message
                error
                header='Please correct errors:'
                content={messages}
            />
          </Form>
        </Segment>
          <Divider horizontal>Or</Divider>
        <Button onClick={() => this.props.history.push('/sign_in')} >Sign In</Button>
      </Container>
    )
  }
};

export default Register;