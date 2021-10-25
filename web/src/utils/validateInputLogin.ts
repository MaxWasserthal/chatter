interface InputValues {
    usernameOrEmail: string;
    password: string;
}

// module to validate inputs on the login page
export const validateInputLogin = (values:InputValues) => {

    if(values.usernameOrEmail === '') {
        return "Please enter your username or email address"
    } else if(values.password === '') {
        return  "Please enter a password"
    } else {
        return ""
    }
}