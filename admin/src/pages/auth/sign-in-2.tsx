import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn2() {
  return (
    <>
      <div className='container grid flex-col items-center justify-center h-svh bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            <CardHeader className='p-0 mb-2'>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username below to login to your account.
              </CardDescription>
            </CardHeader>
            <UserAuthForm />
          </Card>
        </div>
      </div>
    </>
  )
}
