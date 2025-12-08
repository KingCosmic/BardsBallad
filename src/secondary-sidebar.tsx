import { Route, Routes } from "react-router"
import CharacterSidebar from "./components/sidebars/character"
import SystemMenu from "./components/sidebars/system-editor"

export function SecondarySidebar() {
  return (
    <Routes>
      <Route path='/characters/:id' element={<CharacterSidebar />} />
      <Route path='/library/system/:id' element={<SystemMenu />} />
    </Routes>
  )
}

export default SecondarySidebar