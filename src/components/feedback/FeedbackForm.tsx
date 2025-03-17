
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MessageCircle, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define the feedback validation schema
const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  message: z.string().min(3, 'Please provide at least 3 characters of feedback').max(500),
  email: z.string().email().optional().or(z.literal('')),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      message: '',
      email: user?.email || '',
    },
  });

  const handleSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('feedback').insert({
        rating: values.rating,
        message: values.message,
        email: values.email || user?.email,
        user_id: user?.id,
      });
      
      if (error) throw error;
      
      toast.success('Thank you for your feedback!');
      form.reset({
        rating: 5,
        message: '',
        email: user?.email || '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate array of stars for the rating
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>How would you rate your experience?</Label>
          <div className="flex space-x-2">
            {stars.map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 rounded-full transition-all ${
                  form.watch('rating') >= star 
                    ? 'text-amber-500' 
                    : 'text-gray-300'
                }`}
                onClick={() => form.setValue('rating', star)}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience..."
                  className="min-h-24 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!user && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
