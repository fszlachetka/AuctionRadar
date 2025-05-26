import { useState } from 'react'
import { createUser, getUserByLogin } from '../api/userApi.js'
import { isValidLogin, isValidPassword } from '../services/userService.js'

export function useUserManager() {
    const [login, setLogin] = useState('')
    const [passwd, setPasswd] = useState('')
    const [foundLogin, setFoundLogin] = useState('')
    const [foundUser, setFoundUser] = useState(null)

    const handleCreate = async () => {
        if (!isValidLogin(login) || !isValidPassword(passwd)) {
            alert('Login or Password is not valid.')
            return
        }

        try {
            await createUser({ login, passwd })
            alert('User added succesfully!')
        } catch (err) {
            alert('Błąd podczas zapisu')
            console.error(err)
        }
    }

    const handleFind = async () => {
        try {
            const res = await getUserByLogin(foundLogin)
            setFoundUser(res.data)
        } catch (err) {
            alert('User not found')
            console.error(err)
        }
    }

    return {
        login, setLogin,
        passwd, setPasswd,
        foundLogin, setFoundLogin,
        foundUser,
        handleCreate,
        handleFind
    }
}
