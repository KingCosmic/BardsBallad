import { Route, Routes } from "react-router"
import CharacterSidebar from "./components/sidebars/character"

export function SecondarySidebar() {
  return (
    <Routes>
      <Route path='/characters/:id' element={<CharacterSidebar />} />
    </Routes>
  )
}

export default SecondarySidebar