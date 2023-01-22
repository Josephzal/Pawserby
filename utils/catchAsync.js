//  Return function that accepts function, 
//  and then executes this function and catches any errors, 
//  passing to next if error found, 
//  used to wrap async functions

module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    }
};
