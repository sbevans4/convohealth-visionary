
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import RatingStars from './RatingStars';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email').optional(),
  rating: z.number().min(1, 'Please select a rating').max(5),
  message: z.string().min(5, 'Please enter a message of at least 5 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      rating: 0,
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          email: data.email || null,
          rating: data.rating,
          message: data.message,
        });

      if (error) throw error;
      
      toast.success('Thank you for your feedback!');
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!user && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <RatingStars 
                  rating={field.value} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us what you think about the app..." 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
