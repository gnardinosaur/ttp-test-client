import React from 'react';
import { Button, Form, Segment, Container, Message } from 'semantic-ui-react'


class SignIn extends React.Component {

  state = {
    user: {
      email: '',
      password: ''
    },
    error: false,
    message: ''
  };

  handleChange = (e) => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      },
      error: false
    })
  };

  validateUser = () => {
    fetch('https://ttp-test-api.herokuapp.com/api/v1/users/sign_in', {
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
        //render appropriate error message
        this.setState({ 
          error: true,
          message: data.message
         })
      }
    })
  }

  render(){
    return (
      <Container className='sign-in-container'>
        <Segment placeholder>
          <h1>Sign In</h1>
          <br />
          <Form error={this.state.error} onSubmit={this.validateUser}>
            <Form.Field onChange={this.handleChange}>
              <input name='email' placeholder='email...' />
            </Form.Field>
            <Form.Field onChange={this.handleChange}>
              <input name='password' type='password' placeholder='password...' />
            </Form.Field>
            <Button type='submit'>Sign In</Button>
            <Message
                error
                header='Please correct errors:'
                content={this.state.message}
            />
          </Form>
        </Segment>
      </Container>
    )
  }
};

export default SignIn;