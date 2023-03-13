export const  is_phonenumber =(phonenumber : any) => {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if(phonenumber.match(phoneno)) {
      return true;
    }  
    else {  
      return false;
    }
  }