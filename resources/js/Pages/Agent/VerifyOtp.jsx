import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function VerifyOtp({ email }) {
  const inputRefs = useRef([]);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);

  const { data, setData, post, processing, errors } = useForm({
    code: '',
  });

  const { post: resendPost, processing: resending } = useForm({});

  function handleDigitChange(index, value) {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Update form data
    setData('code', newDigits.join(''));

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    // Handle backspace
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    setData('code', newDigits.join(''));

    // Focus last filled input or first empty
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    post('/agent/otp/verify');
  }

  function handleResend() {
    resendPost('/agent/otp/resend');
  }

  const isComplete = digits.every((d) => d !== '');

  return (
    <>
      <Head title="Verify OTP" />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">
              Verify your email
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit code to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
                <span className="font-medium">Demo:</span> Use code{' '}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono font-semibold dark:bg-blue-900/50">
                  123456
                </code>{' '}
                to verify.
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp-0" className="sr-only">
                  OTP Code
                </Label>
                <div className="flex justify-center gap-2 mt-3">
                  {digits.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="h-12 w-12 text-center text-lg font-semibold"
                      aria-invalid={!!errors.code}
                    />
                  ))}
                </div>
                {errors.code && (
                  <p className="text-sm text-destructive text-center" role="alert">
                    {errors.code}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-3">
              <Button
                type="submit"
                className="w-full"
                disabled={!isComplete || processing}
              >
                {processing ? 'Verifying…' : 'Verify'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary font-medium underline-offset-4 hover:underline disabled:opacity-50"
                >
                  {resending ? 'Sending…' : 'Resend'}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
