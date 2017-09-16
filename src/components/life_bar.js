import React, { Component } from 'react';

class LifeBar extends Component{
	render(){
		if(this.props.life<1) return <div className="lifeBar"/>; 
		
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