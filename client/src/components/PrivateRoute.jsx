import { Navigate, Outlet } from "react-router-dom"
import useAuthStatus from "../hooks/useAuthStatus"
import LoadingScreen from "./LoadingScreen"

const PrivateRoute = () => {

    const { isLoggedIn, checkingStatus } = useAuthStatus()

    if (checkingStatus) {
        return (
            <LoadingScreen text="Checking User Authentication..." />
        )
    }

    return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />

}

export default PrivateRoute