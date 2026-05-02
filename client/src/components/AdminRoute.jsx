import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import useAuthStatus from "../hooks/useAuthStatus"
import LoadingScreen from "./LoadingScreen"

const AdminRoute = () => {
    const { isLoggedIn, checkingStatus } = useAuthStatus()
    const { user } = useSelector(state => state.auth)

    if (checkingStatus) {
        return <LoadingScreen text="Checking Admin Authentication..." />
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }

    // Assuming user.isAdmin exists. If not, this might need adjustment.
    return user && user.isAdmin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute
