import React from 'react';
import { List, Container, Grid, Header } from 'semantic-ui-react';
import { formatter } from '../constants/formatCurrency';

class UserStocks extends React.Component {
  _isMounted = false;

  state = {
    userStocks: [],
    summedArray: []
  }

  componentDidMount(){
    fetch(`https://ttp-test-api.herokuapp.com/api/v1/users/${this.props.user.id}/transactions`)
    .then(resp => resp.json())
    .then(userStocks => this.setState({ userStocks }, () => this.buildUserStockObject()))
  };

  //update user's list of stocks when new stocks are purchased 
  componentDidUpdate(prevProps, prevState) { 
    if(this.state !== prevState) {
      if(this._isMounted) {
        fetch(`https://ttp-test-api.herokuapp.com/api/v1/users/${this.props.user.id}/transactions`)
        .then(resp => resp.json())
        .then(userStocks => this.setState({ userStocks }, () => this.buildUserStockObject())) 
      }
    }
  }

  //fn to make sure component doesn't continue to try check state --> this prevents memory leak error and increases preformance 
  componentWillUnmount() {
    this._isMounted = false;
  }

  buildUserStockObject = () => {
    //create a simple object --> {ticker: number of shares}
    const tickersAndQtyObject = {};
    this.state.userStocks.forEach(el => {
      if(tickersAndQtyObject[el.ticker]){
        tickersAndQtyObject[el.ticker] += el.num_shares
      } else {
        tickersAndQtyObject[el.ticker] = el.num_shares;
      }
    })
    //convert the object back to an array with summed number of shares owned by that user 
    const summedArray = Object.entries(tickersAndQtyObject)
    this.setState({ summedArray });
    this.portfolioTotal(summedArray);
  }

  portfolioTotal = (summedArray) => {
    let currentPriceArray = [];
    [...summedArray].forEach(el => {
      currentPriceArray.push(this.props.currentPrices[el[0]].lastPrice * el[1])
    })
    let total = currentPriceArray.length === 0 ? 0 : currentPriceArray.reduce((acc, cv) => acc + cv)
    this.props.totalPortfolioValue(total)
  }

  render(){
    //map through user's stocks and count and return array containing components to render - each component contains a) ticker, b) # shares, and c) qty * current price 
    const stockList = this.state.summedArray.map((el, index) => {
      //change color of text based on lastPrice and PreviousClose --> if lastPrice > PrevClose then green text, if lastPrice < prevClose red text, otherwise gray text
      let currentPrice;
      if(this.props.currentPrices[el[0]].lastPrice > this.props.currentPrices[el[0]].prevClose) {
        currentPrice = <p style={{ color: 'green' }}>{formatter.format(this.props.currentPrices[el[0]].lastPrice * el[1])}</p>
      } else if (this.props.currentPrices[el[0]].lastPrice === this.props.currentPrices[el[0]].prevClose) {
        currentPrice = <p style={{ color: 'gray' }}>{formatter.format(this.props.currentPrices[el[0]].lastPrice * el[1])}</p>
      } else {
        currentPrice = <p style={{ color: 'red' }}>{formatter.format(this.props.currentPrices[el[0]].lastPrice * el[1])}</p>
      }
      return (
        <List.Item key={index}>
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
              <Header as='h4'>{el[0]}</Header>
            </Grid.Column>
            <Grid.Column>
              {el[1]} Shares
            </Grid.Column>
            <Grid.Column>
              {currentPrice}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </List.Item>
      )
    });

    //this is the render() return 
    return (
      <Container>
        {/* render list of user's stocks */}
        <List divided relaxed> 
          {stockList}
        </List>
      </Container>
    )
  }

};

export default UserStocks;
