interface InputValues {
    username: string;
    password: string;
    email: string;
}

export const validateInputRegister = (values:InputValues) => {

    if(values.username === '') {
        return "Please enter a username"
    } else if(values.email === '') {
        return "Please enter your email address"
    } else if(values.password === '') {
        return  "Please enter a password"
    } else {
        return ""
    }
}