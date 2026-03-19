import { MemoryRouter, Routes, Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import CreateLayout from "./layouts/CreateLayout"
import Home from "./pages/home/Home"
import Create from "./pages/create/Create"
import InputPage from "./pages/create/InputPage"
export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home/>}/>
          <Route path="create" element={<CreateLayout/>}>
            <Route index element={<Create/>}/>
            <Route path="input/:templateId" element={<InputPage/>}/>
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}