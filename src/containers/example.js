// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { selectBook } from '../actions/index';
// import { bindActionCreators } from 'redux';

// class BookList extends Component{
	
// 	renderList(){
// 		return this.props.books.map( book => {  
// 			return (
// 			  <li 
// 			  	key={book.title} 
// 			  	onClick={ ()=> this.props.selectBook(book) }
// 			  	className="list-group-item">{book.title}</li>
// 				);
// 		});
// 	}

// 	render(){
// 	  return (
// 		 <ul className="list-group col-sm-4">
// 		 	{this.renderList()}
// 		 </ul>
// 		);
// 	}
// }

// //React-Redux

// //Obtener estados -> props
// function mapStateToProps(state){	
// 	//Aqui le metemos a props lo que ocupemos del state
// 	return {
// 		books: state.books
// 	};
// }

// //Invocar acciones, disponibles desde props
// function mapDispatchToProps(dispatch){
// 	//Aqui pasamos todas las actions que ocupemos
// 	return bindActionCreators( {selectBook} , dispatch);
// }

// //Promote BookList to a Container from Component
// //It needs to know about this new dispatch method, selectBook. Available as prop
// export default connect(mapStateToProps, mapDispatchToProps)(BookList);