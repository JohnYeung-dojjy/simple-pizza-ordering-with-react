import React, { Component } from 'react';
import './app.css';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';


const styles ={
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', 
  },
  chip: {
    margin: "5px",
  },
  th: {
    fontSize: "24px"
  },
  title: {
    textAlign: "left"
  },
  order_container: {
    position: "absolute",
    display: "flex",
    justifyContent: "space-between",
    bottom: 0,
    width: "100%",
    paddingTop: "6px",
    paddingBottom: "6px",    
    textAlign: "left"
  },
}

export default class App extends Component {  
  state = { pizza_data: null, order: [], confirmed: false, deliveryTime: 0 };  
  componentDidMount() {
    fetch('/api/pizzas')
      .then(res => res.json())
      .then(data => this.setState({pizza_data: data}))
  }
  handleRowClick(e, row) {
    if(this.state.order.filter(item => item.pizza.name == row.name).length == 0) {
      this.setState((state) =>({order: [...state.order, {pizza: row, qt: 1}]}))
    } else {      
      let items = this.state.order
      items.filter(item => item.pizza.name == row.name)[0].qt += 1
      this.setState({order: items})
    
    }
  }
  handleDelete(itemToDelete) {
    this.setState((state) => ({order: state.order.filter(item => item.pizza.name != itemToDelete.pizza.name)}))
  }
  handleConfirm(e) {
    e.preventDefault()
    fetch("/api/confirm")
    .then(res => res.json())
    .then(data =>  {
      if(data.success) {
        this.setState({confirmed: true, deliveryTime: data.deliveryTime })}
      }
    )
  }

  render() {
    const { username } = this.state;    
    const rows = this.state.pizza_data
    const order = this.state.order
    if(this.state.pizza_data != null) {
      if(!this.state.confirmed){
    return (
      <div> 
         <Typography variant="h3" component="h2" style={styles.title} gutterBottom>Welcome to the PizzaNut. You can complete your order online here!</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={styles.th}>Name</TableCell>
                  <TableCell style={styles.th} align="right">Price</TableCell>
                  <TableCell style={styles.th} align="right">Ingredients</TableCell>                  
                  <TableCell style={styles.th} align="right">Add</TableCell>                  
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right"><span>{row.price}</span></TableCell>
                    <TableCell align="right">{row.ingredients.map(ingredient => (<Chip key={ingredient} label={ingredient} style={styles.chip}></Chip>))}</TableCell>
                    <TableCell align="right"><IconButton onClick={(e) => this.handleRowClick(e, row)}><AddBoxIcon/></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </TableContainer>           
        <Paper elevation={3} style={styles.order_container}>
                <Typography variant="h6">Your order is:  {
                  order.length == 0 ? (
                    <span>empty</span>
                  ) : (                    
                    order.map(item => (
                      <Chip onDelete={() => this.handleDelete(item)} label={item.pizza.name + " x" + item.qt} color="primary"/>
                    ))
                  )
                } </Typography> {order.length == 0 ? (<span></span>) : (<Button variant="contained" color="primary" onClick={(e) => this.handleConfirm(e)}>Confirm</Button>)}
        </Paper>
      </div>
    )}
      else {
        return (
        <Typography variant="h3" component="h2" gutterBottom>Thank you! Your order will be delivered in {this.state.deliveryTime/60000} minutes</Typography>
        )
      }
  } 
    else {
      return (<h1>Loading</h1>);
    }
  }
}
