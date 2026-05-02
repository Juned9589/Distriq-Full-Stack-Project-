import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const useAuthStatus = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const { user } = useSelector(state => state.auth)

    useEffect(() => {

        user ? setIsLoggedIn(true) : setIsLoggedIn(false)
        setCheckingStatus(false)
    }, [user])

    return { isLoggedIn, checkingStatus }
}

export default useAuthStatus