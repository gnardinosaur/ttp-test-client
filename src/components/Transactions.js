import React from 'react';
import { Header, List, Container, Grid } from 'semantic-ui-react';
import { formatter } from '../constants/formatCurrency';

class Transactions extends React.Component {

  state = {
    userStocks: []
  }

  componentDidMount(){
    fetch(`http://ttp-test-api.herokuapp.com/users/${this.props.user.id}/transactions`)
    .then(resp => resp.json())
    .then(userStocks => this.setState({ userStocks }))
  };


  render(){
    const stockList = this.state.userStocks.map((el, index) => {
      return (
        <List.Item key={index}>
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
              <Header as='h4'>{el.ticker}</Header>
            </Grid.Column>
            <Grid.Column>
              {el.num_shares} Shares
            </Grid.Column>
            <Grid.Column>
              {formatter.format(el.num_shares * el.price)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </List.Item>
      )
    })

    return (
      <Container className='transactions'>
        <List as='a' divided={true} horizontal floated='right'>
          <List.Item id='nav-link' onClick={() => this.props.history.push('/portfolio')} content={<u>Portfolio</u>} />
          <List.Item disabled={true} content={<u>Transactions</u>} />
        </List>
        <br />
        
        <Header as='h1' textAlign='left'>Transactions</Header>
        <br />

        <Grid columns={2} divided relaxed='very'>
          <Grid.Row>
            <Grid.Column>
            <List divided relaxed> 
              {stockList}
            </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  };
};

export default Transactions; 