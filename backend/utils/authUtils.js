import validator from "validator";

const verifySignUpData = (req) => {  
    const { email, password } = req.body;
    
    if(!email || !password){
        throw new Error("All fields are required")
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid email Id")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough")
    }
}

export { verifySignUpData };