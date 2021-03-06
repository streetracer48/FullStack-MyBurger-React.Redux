import {toastr} from 'react-redux-toastr'
import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'


export const authStart = () =>
        {
            return {
                type:actionTypes.AUTH_START

            };
        };

        export const authSuccess = (token, userId) =>
        {

            return async  dispatch => {
                try {
                    dispatch( {
                        type:actionTypes.AUTH_SUCCESS,
                        idToken:token,
                        userId:userId
                    })
        
                    toastr.success('Success!', 'You are logged in successfully')
                   
                }
                catch(error) {
                    toastr.error('Error !', 'Something Went Wrong ')
                }
            }
        };

        export const authFail = (error) =>
         {
            return {
                type:actionTypes.AUTH_FAIL,
                error:error
            };
        };


        export const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userId')

            return {
                type:actionTypes.AUTH_LOGOUT,

            }

        }



        export const authCheckTimeout = (expirationTime) => {

            return dispatch => {
                setTimeout(() => {
               dispatch(logout())

                }, expirationTime * 1000);

            };

        }


export const auth = (email, password, isSignup) => {
    return dispatch => {
       dispatch(authStart());
       const signupData = {
           email:email,
           password:password,
           returnSecureToken:true
       };

                let url= 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyA6b0QEdi57X5XdwE1IySeuTobD0rwRO2g'
            if(!isSignup) {
                url='https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyA6b0QEdi57X5XdwE1IySeuTobD0rwRO2g'
            }

       axios.post(url,signupData)
       .then(response => {
           const expirationDate= new Date(new Date().getTime() + response.data.expiresIn * 1000)
           localStorage.setItem('token', response.data.idToken);
           localStorage.setItem('expirationDate', expirationDate);
           localStorage.setItem('userId', response.data.localId)
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(authCheckTimeout(response.data.expiresIn))
       })
       .catch(error => {
            // console.log(error);
            dispatch(authFail(error.response.data.error));
       })


    };

}


export const setAuthRedirectPath = (path) => {
 return {
     type:actionTypes.SET_AUTH_REDIRECT_PATH,
     path:path

 }
}

export const authCheckState = () => {

    return dispatch => {
        const token= localStorage.getItem('token');

         if(!token){
             dispatch(logout());
         }

          else {
const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate<= new Date())
            {
                dispatch(logout())
            }


            else
            {
                 const userId = localStorage.getItem('userId')
                 dispatch(authSuccess(token, userId));
                 dispatch(authCheckTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))


            }


          }

    }

}






