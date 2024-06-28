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

interface User {
  id: string;
  username: string;
  kata_sandi: string;
  name: string; // Example property
  email: string; // Example property
}

interface UserAuthFormProps {
  className?: string;
}

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter your username' })
    .nonempty({ message: 'Invalid username address' }), 
  kata_sandi: z
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
  const { login, user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      kata_sandi: '',
    },
  });

  const myUsername = 'admin'; 
  const myPassword = 'admin123'; 

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setUsernameError(null);
    setPasswordError(null);

    const { username, kata_sandi } = data;

    try {
      if (username === myUsername && kata_sandi === myPassword) {
        const user: User = { 
          id: '1',
          username, 
          kata_sandi,
          name: 'John Doe', // Example value
          email: 'john.doe@example.com', // Example value
        };
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        login(user);
        navigate('/');
      } else {
        setUsernameError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed', error);
      setUsernameError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  }

  if (user) {
    console.log('User logged in:', user);
  }

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
              name="kata_sandi"
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
