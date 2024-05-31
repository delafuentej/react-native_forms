import express from 'express';
import{check, validationResult} from 'express-validator';


// port

const PORT=3030;
//to initiate express
const app= express();
//middelware=> middleware functions have access to the req/ res object and the next function in the apps request-response cycle
//middlewares allow intercept a request, to apply some logic, to send it to the next middleware in the request
app.use(express.json());


// second argument=>array=> it perfoms the server-side validation
app.post('/form',[
//it checks for the param 'username' wich comes from the client side. If it is empty the message is sent back to the client
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is a required field'),
    check('email') 
        .isEmail()
        .withMessage('Invalid Email Address'),
    check('password')
        .isLength({min:8})
        .withMessage('Password must be at least 8 characters')
        .isLength({mas:32})
        .withMessage('Password must be atmost 32 characters')
        //custom method=> to check if the password and the confirmPass are the same
        .custom((password, {req})=>{
            if( password === req.body.confirmPass){
                return password;
            }else{
                throw new Error('Password do not match')
            }
        }),
],
(req, res)=>{
    //validationResult to dealing with errors. It takes in the req  object and returns an error to sent it back to the client
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }// whent there are no errors, it takes 'username', 'email' and 'password' and create the user and send a message success back to the client
    const {username, email, password} = req.body;
    //todo create a  user with the above data
    res.json({success:true, message:'User created successfully', user: {username, email}});
},

)

app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}`)
});