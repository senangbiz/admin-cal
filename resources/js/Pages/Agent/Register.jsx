import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Account', description: 'Create your user account' },
  { id: 2, title: 'Agent details', description: 'Profile and brands' },
];

export default function AgentRegister({ brands = [] }) {
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { data, setData, transform, post, processing, errors, clearErrors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    showroom_location: '',
    coverage_areas_str: '',
    coverage_areas: [],
    brand_id: null,
    profile_photo: null,
  });

  // Keep coverage_areas in sync for submit
  const coverageAreas =
    data.coverage_areas_str?.trim()
      ? data.coverage_areas_str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      : [];

  const selectedBrand = brands.find((b) => b.id === data.brand_id) ?? null;

  // Fields belonging to each step
  const step1Fields = ['name', 'email', 'password', 'password_confirmation'];
  const step2Fields = ['phone', 'profile_photo', 'showroom_location', 'coverage_areas', 'brand_id'];

  // Check if there are errors for a specific step
  const hasStep1Errors = step1Fields.some((field) => errors[field]);
  const hasStep2Errors = step2Fields.some((field) => errors[field]);

  // Auto-navigate to step with errors
  useEffect(() => {
    if (hasStep1Errors && step !== 1) {
      setStep(1);
    } else if (hasStep2Errors && !hasStep1Errors && step !== 2) {
      setStep(2);
    }
  }, [errors]);

  function handleBrandValueChange(value) {
    setData('brand_id', value?.id ?? null);
    clearErrors('brand_id');
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setData('profile_photo', file);
      setPhotoPreview(URL.createObjectURL(file));
      clearErrors('profile_photo');
    }
  }

  function handleNext() {
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }
    transform((data) => ({
      ...data,
      coverage_areas: coverageAreas,
    }));
    post('/agent/register', { forceFormData: true });
  }

  const canProceedStep1 =
    data.name.trim() &&
    data.email.trim() &&
    data.password &&
    data.password_confirmation &&
    data.password === data.password_confirmation;

  const canProceedStep2 =
    data.phone.trim() &&
    data.showroom_location.trim() &&
    data.coverage_areas_str?.trim() &&
    data.brand_id !== null;

  return (
    <>
      <Head title="Agent Register" />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">
              Agent Registration
            </CardTitle>
            {/* Stepper indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {STEPS.map((s, i) => {
                const stepHasErrors = s.id === 1 ? hasStep1Errors : hasStep2Errors;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                        stepHasErrors
                          ? 'border-destructive bg-destructive text-destructive-foreground'
                          : step === s.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : step > s.id
                              ? 'border-primary bg-primary/20 text-primary'
                              : 'border-input bg-muted text-muted-foreground'
                      )}
                    >
                      {stepHasErrors ? '!' : step > s.id ? '✓' : s.id}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          'h-0.5 w-6 rounded',
                          step > s.id ? 'bg-primary' : 'bg-border'
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      value={data.name}
                      onChange={(e) => {
                        setData('name', e.target.value);
                        clearErrors('name');
                      }}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => {
                        setData('email', e.target.value);
                        clearErrors('email');
                      }}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={data.password}
                      onChange={(e) => {
                        setData('password', e.target.value);
                        clearErrors('password');
                      }}
                      aria-invalid={!!errors.password}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                      Confirm password
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={data.password_confirmation}
                      onChange={(e) => {
                        setData('password_confirmation', e.target.value);
                        clearErrors('password_confirmation');
                      }}
                      aria-invalid={!!errors.password_confirmation}
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.password_confirmation}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="profile_photo">Profile photo</Label>
                    <div className="flex items-center gap-4">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="h-16 w-16 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-muted border flex items-center justify-center text-muted-foreground text-xs">
                          No photo
                        </div>
                      )}
                      <Input
                        id="profile_photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="flex-1"
                        aria-invalid={!!errors.profile_photo}
                      />
                    </div>
                    {errors.profile_photo && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.profile_photo}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="+60 12 345 6789"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(e) => {
                        setData('phone', e.target.value);
                        clearErrors('phone');
                      }}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="showroom_location">Showroom location</Label>
                    <Textarea
                      id="showroom_location"
                      placeholder="Address or city"
                      value={data.showroom_location}
                      onChange={(e) => {
                        setData('showroom_location', e.target.value);
                        clearErrors('showroom_location');
                      }}
                      rows={3}
                      aria-invalid={!!errors.showroom_location}
                      className="resize-y min-h-20"
                    />
                    {errors.showroom_location && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.showroom_location}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverage_areas_str">Coverage areas</Label>
                    <Input
                      id="coverage_areas_str"
                      type="text"
                      placeholder="Area 1, Area 2, Area 3"
                      value={data.coverage_areas_str}
                      onChange={(e) => {
                        setData('coverage_areas_str', e.target.value);
                        clearErrors('coverage_areas');
                      }}
                      aria-invalid={!!errors.coverage_areas}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of areas you cover
                    </p>
                    {errors.coverage_areas && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.coverage_areas}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brands-combobox">Brand</Label>
                    <Combobox
                      items={brands}
                      value={selectedBrand}
                      onValueChange={handleBrandValueChange}
                      itemToStringLabel={(b) => b.name}
                      isItemEqualToValue={(a, b) => (a?.id ?? a) === (b?.id ?? b)}
                    >
                      <ComboboxInput
                        id="brands-combobox"
                        placeholder="Select a brand"
                        className="w-full"
                        aria-invalid={!!errors.brand_id}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No brands found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item}>
                              {item.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {errors.brand_id && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.brand_id}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex w-full gap-2 mt-3">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className={step === 2 ? 'flex-1' : 'w-full'}
                  disabled={
                    step === 1
                      ? !canProceedStep1
                      : !canProceedStep2 || processing
                  }
                >
                  {step === 1
                    ? 'Next'
                    : processing
                      ? 'Creating account…'
                      : 'Create account'}
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Already have an agent account?{' '}
                <Link
                  href="/agent/login"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
