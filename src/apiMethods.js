/*
  Goto https://reqres.in/ for documentation on this api.
  
  If you haven't used axios, documentation here: https://github.com/axios/axios
  OR use any method / library you're comfortable with to perform the request(s).

  **** These stubs are just provided as a convienece, ****
  **** feel free to change whatever you like to accomplish the goal. ****
*/

import axios from "axios";

const baseUrl = "https://reqres.in/api";

//with small API, I prefer to use object and pass it around tree as a prop rather than importing/passing individual methods. 
const API = {
  getUsers:(page, cb) => {

    if(typeof page !== 'number'){
      console.error('invalid getUsers page parameter type', page);
      return;
    }

    const reqURL = `${baseUrl}/users/?page=${page}`
  
    axios.get(reqURL)
      .then((res)=>{
        // console.log('res', res);
        if(cb) cb(res)
      })
      .catch((err)=>{
        console.error('err', err);
      })
  
  },
  deleteUser: (userID, cb) => {

    if(typeof userID !== 'number'){
      console.error('invalid deleteUser userID parameter type', userID);
      return;
    }
    
    const reqURL = `${baseUrl}/users/${userID}`
  
    axios.delete(reqURL)
      .then((res)=>{
        // console.log('res', res);
        if(cb) cb(res)
      })
      .catch((err)=>{
        console.error('err', err);
      })

  }
  
}

export default API;
