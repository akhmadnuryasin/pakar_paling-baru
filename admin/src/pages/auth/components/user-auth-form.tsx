import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../auth-context';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/password-input';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  password: string;
}

interface UserAuthFormProps {
  className?: string;
}

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter your username' })
    .nonempty({ message: 'Invalid username address' }), 
  password: z
    .string()
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
});

export function UserAuthForm({ className }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setUsernameError(null);
    setPasswordError(null);
  
    const { username, password } = data;
  
    try {
      const response = await axios.post('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/login', { username, password });
      
      // console.log('API response:', response); // Log the response for debugging
  
      if (response.status === 200) {
        const { id, username: responseUsername } = response.data;
        // console.log('Parsed user data:', { id, username: responseUsername });
        const user: User = {
          id,
          username: responseUsername,
          password,
        };
  
        localStorage.setItem('user', JSON.stringify(user));
        login(user);
        navigate('/');
      } else {
        setUsernameError('Invalid username or password');
      }
    } catch (error) {
      // console.error('Login failed', error);
      setUsernameError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  }

  // if (user) {
  //   console.log('User logged in:', user);
  // }

  return (
    <div className={cn('grid gap-6', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {usernameError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{usernameError}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" type="submit" loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
