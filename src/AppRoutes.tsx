import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home/home";
import AppIndex from "./pages/index/AppIndex";
import { Sobre } from "./pages/Sobre/Sobre";

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="" element={<Navigate to={`/transparencia/home`} replace />} />

            <Route path="transparencia" element={<AppIndex />}>
                <Route index path="" element={<Navigate to={`/transparencia/home`} replace />} />
                <Route path="home" element={<Sobre />} />
                <Route path="dados" element={<Home />} />
                <Route path="sobre" element={<Navigate to="/transparencia/home" replace />} />
            </Route>
        </Routes>
    )
}
