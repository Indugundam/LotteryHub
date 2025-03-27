
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      await resetPassword(values.email);
      setEmailSent(true);
      
      toast({
        title: "Email sent",
        description: "Password reset instructions have been sent to your email.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      
      toast({
        variant: 'destructive',
        title: "Reset request failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
            <p className="text-muted-foreground">
              {emailSent 
                ? "Check your email for reset instructions" 
                : "Enter your email to receive password reset instructions"}
            </p>
          </div>

          {!emailSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary/10 text-primary p-4 rounded-lg text-center">
                <Mail className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Check your inbox</p>
                <p className="text-sm mt-1">We've sent password reset instructions to your email</p>
              </div>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          )}

          {!emailSent && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Remember your password?{' '}
              </span>
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
