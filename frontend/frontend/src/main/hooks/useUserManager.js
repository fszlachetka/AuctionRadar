// frontend/frontend/src/main/hooks/useUserManager.js
import { useState } from 'react'
import { createUser, getUserByLogin, loginUser } from '../api/userApi.js'
import { isValidLogin, isValidPassword } from '../services/userService.js'
import {saveTokens} from "../services/authService.js";

export function useUserManager() {
    const [login, setLogin] = useState('')
    const [passwd, setPasswd] = useState('')
    const [foundLogin, setFoundLogin] = useState('')
    const [foundPasswd, setFoundPasswd] = useState('')
    const [foundUser, setFoundUser] = useState(null)

    const handleCreate = async () => {
        if (!isValidLogin(login) || !isValidPassword(passwd)) {
            alert('Login or Password is not valid.')
            return
        }

        try {
            await createUser({ login, passwd })
            alert('User added successfully!')
        } catch (err) {
            alert('Error creating user')
            console.error(err)
        }
    }

    const handleFind = async () => {
        if (!isValidLogin(foundLogin) || !isValidPassword(foundPasswd)) {
            alert('Login or Password is not valid.')
            return
        }

        try {
            const res = await getUserByLogin(foundLogin)
            if (res.data.passwd === foundPasswd) {
                setFoundUser(res.data)
            } else {
                alert('Invalid password')
                setFoundUser(null)
            }
        } catch (err) {
            alert('User not found')
            console.error(err)
            setFoundUser(null)
        }
    }

    const handleLogin = async ()=>{
        try{
            console.log("click")
            const response = await loginUser(login,passwd);

            const {accessToken, refreshToken} = response.data;
            if(accessToken && refreshToken){
                console.log("AC:" + accessToken.toString())
                console.log("REF: " + refreshToken.toString())
                saveTokens({accessToken,refreshToken});
                setFoundLogin(login);
                setFoundPasswd("PLACEHOLDER");
                return true;
            } else {
                console.error("No tokens in response");
                return false;
            }
        } catch (error){
            if(error.response){
                console.error("Login error: ", error.response.data);
            } else {
                console.error("Network error: ", error.message);
            }
            return false;
        }
    }

    return {
        login, setLogin,
        passwd, setPasswd,
        foundLogin, setFoundLogin,
        foundPasswd, setFoundPasswd,
        foundUser,
        handleCreate,
        handleLogin
    }
}