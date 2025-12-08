import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "./login"
import { useEffect, useState } from "react"
import { SignupForm } from "./register"
import { useNavigate } from "react-router"
import { authState } from "@/state/auth"
import Header from '@/components/header'
import PageContent from '@/components/page-content'

export default function LoginPage() {
  const [isSignup, setSignup] = useState(false)

  const navigate = useNavigate()

  const { isLoggedIn } = authState.useValue()

  useEffect(() => {
    if (isLoggedIn) navigate('/settings')
  }, [isLoggedIn])

  return (
    <div>
      <Header title='Authenticate' subtitle='Forgot your keys?' />

      <PageContent className='flex flex-col items-center justify-center gap-6 p-6 md:p-10'>
        <div className="flex w-full max-w-sm flex-col gap-6">
          {
            isSignup ? <SignupForm toggleSignup={setSignup} /> : <LoginForm toggleSignup={setSignup} />
          }
        </div>
      </PageContent>
    </div>
  )
}