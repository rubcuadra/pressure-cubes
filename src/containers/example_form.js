import _ from 'lodash';
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import {createPost} from '../actions/index';

class PostsNew extends Component{

	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	renderField(field){
		//Sacar meta de field, despues sacar touched y error de meta
		const { meta: {touched, error} } = field;
		const className = `form-group ${touched&&error?'has-danger':''}`

		return (
		<div className={className}>
			<label>{field.label}</label>
			<input 
			  className='form-control'
			  type="text"
			  {...field.input}/>
			  <div className='text-help'>
			  	{touched?error:''}
			  </div>
		</div>)
	}

	onSubmit(values){
		this.props.createPost(values, ()=>this.props.history.push('/') );
	}

	render(){
		const {handleSubmit} = this.props; //La agrega reduxForm
		
		return (
			<form onSubmit={handleSubmit( this.onSubmit )}>
				<Field 
				  name="title"
				  label='Title'
				  component={this.renderField}/>
				<Field 
				  name="categories"
				  label='Categories'
				  component={this.renderField}/>
				<Field 
				  name="content"
				  label='Post content'
				  component={this.renderField}/>
				<button type='submit' className="btn btn-primary">Submit</button>
				<Link to="/" className="btn btn-danger">Cancel</Link>
			</form>
		);
	}
}

//Necesaria, se le debe pasar al reduxForm y siempre tendra un object values
function validate(values){
	const errors = {};

	//Validate
	if (!values.title) {
		errors.title = "Enter a title!";
	}
	if (!values.categories) {
		errors.categories = "Enter at least one category!";
	}
	if (!values.content) {
		errors.content = "Enter some content!";
	}

	//If errors == {}, OK, se hace el submit
	//else Hay un error en la validacion
	return errors;
}

//Handle multiple forms correctly by using 'form'
//Must bew unique across the app 
export default reduxForm({
	validate,
	form: 'PostsNewForm'
})( connect(null,{ createPost })(PostsNew) );