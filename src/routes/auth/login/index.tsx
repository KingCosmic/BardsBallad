import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { login } from "@/lib/api/auth/login"

export function LoginForm({
  className,
  toggleSignup,
  ...props
}: React.ComponentProps<"div"> & { toggleSignup(b: boolean): void }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your username or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()

            login(username, password)
          }}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='username'>Username or Email</FieldLabel>
                <Input
                  id='username'
                  placeholder='BillyJoeBob'
                  required
                  value={username} onChange={v => setUsername(v.currentTarget.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required value={password} onChange={v => setPassword(v.currentTarget.value)} />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Button variant='link' onClick={() => toggleSignup(true)}>Sign up</Button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}