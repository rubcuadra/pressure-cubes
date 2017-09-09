//REQUIERE REDUX_THUNK como MIDLEWERE
// import Firebase from 'firebase';
// const Posts = new Firebase('https://firebaseproject.firebaseio.com/');
// export function fetchPost(){
// 	return dispatch => {
// 		Posts.on('value', snapshot=>{
// 			dispatch({
// 				type: 'FETCH_POST',
// 				payload: snapshot.val()
// 			});
// 		});
// 	};
// }

// export function createPost(post){
// 	return dispatch => {
// 		Posts.push(post);	
// 	};
// }

// export function deletePost(key){
// 	return dispatch => {
// 		Posts.child(key).remove();	
// 	};
// }