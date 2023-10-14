exports.isAuth=(req , res , next)=>{
    if(req.session.userId) next();
    else{
        res.redirect('/login');
    }
}

exports.noAuth=(req , res , next)=>{
    if(!req.session.userId) next();
    else{
        res.redirect('/');
    }
}  