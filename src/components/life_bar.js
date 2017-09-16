import React, { Component } from 'react';

class LifeBar extends Component{
	render(){
		console.log(window.innerWidth);
		// {this.props.life} <i className="fa fa-heart"></i> 
		return (
			<div className="lifeBar"> 
				{[...Array(this.props.life)].map((_, i)=>{
					return  <i key={i} className="fa fa-heart"></i> 
				})}
			</div>
	  );
	}
}

export default LifeBar ;