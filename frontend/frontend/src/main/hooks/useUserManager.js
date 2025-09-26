import { useState } from 'react'
import { createUser, loginUser } from '../api/userApi.js'
import { isValidLogin, isValidPassword } from '../services/userService.js'
import { saveTokens } from '../services/authService.js'

export function useUserManager() {
    const [foundLogin, setFoundLogin] = useState('')
    const [foundPasswd, setFoundPasswd] = useState('')
    const [login, setLogin] = useState('')
    const [passwd, setPasswd] = useState('')
    const [foundUser, setFoundUser] = useState(null)

    const handleCreate = async () => {
        if (!isValidLogin(login) || !isValidPassword(passwd)) {
            alert('Login lub hasło nieprawidłowe')
            return
        }

        try {
            await createUser({ login, passwd })
            alert('Użytkownik dodany pomyślnie!')
            setLogin('')
            setPasswd('')
        } catch (err) {
            alert('Błąd podczas tworzenia użytkownika')
            console.error(err)
        }
    }

    const handleLogin = async () => {
        if (!isValidLogin(foundLogin) || !isValidPassword(foundPasswd)) {
            alert('Login lub hasło nieprawidłowe')
            return
        }

        try {
            const response = await loginUser(foundLogin, foundPasswd)
            const { accessToken, refreshToken } = response.data
            saveTokens({ accessToken, refreshToken })
            localStorage.setItem('userId', response.data.userId)
            localStorage.setItem('login', foundLogin)
            setFoundUser({ login: foundLogin })
            setFoundPasswd('')
            window.location.href = '/logged'
        } catch (err) {
            alert('Nieprawidłowe dane logowania')
            console.error(err)
        }
    }

    return {
        login,
        setLogin,
        passwd,
        setPasswd,
        foundLogin,
        setFoundLogin,
        foundPasswd,
        setFoundPasswd,
        foundUser,
        handleCreate,
        handleLogin
    }
}