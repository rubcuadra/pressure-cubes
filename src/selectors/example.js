import _ from 'lodash';
import {createSelector} from 'reselect';

const postsSelector = state => state.posts;
const selectedPostsSelector = state => state.selectedPostsId;

const getPosts = (posts,selectedPostsId) => {
	const selectedPosts = _.filter(
			posts,
			post => _.contains( selectedPostsId ,post.id)
		);
	return selectedPosts;
};

export default createSelector(
		postsSelector,
		selectedPostsSelector,
		getPosts  //El ultimo parametro es la funcion selector
);


//AL unir el component usando la funcion 
//mapStateToProps = state=>{ return posts:thisFile(state) };

//Nos sirve para generar estados calculados a partir de otro estado o condicion