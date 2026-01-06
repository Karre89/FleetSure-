'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { Truck, Wrench, Package, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  role: z.enum(['fleet', 'mechanic', 'runner']),
  fleetName: z.string().optional(),
  fleetAddress: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine(
  (data) => {
    if (data.role === 'fleet') {
      return data.fleetName && data.fleetName.length > 0
    }
    return true
  },
  {
    message: 'Fleet name is required',
    path: ['fleetName'],
  }
)

type RegisterForm = z.infer<typeof registerSchema>

const roles = [
  {
    id: 'fleet',
    title: 'Fleet Manager',
    description: 'Manage your trucks and request repairs',
    icon: Truck,
    color: 'blue',
  },
  {
    id: 'mechanic',
    title: 'Diesel Mechanic',
    description: 'Provide mobile repair services',
    icon: Wrench,
    color: 'green',
  },
  {
    id: 'runner',
    title: 'Parts Runner',
    description: 'Deliver parts to repair sites',
    icon: Package,
    color: 'purple',
  },
]

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') as 'fleet' | 'mechanic' | 'runner' | null

  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'role' | 'details'>(defaultRole ? 'details' : 'role')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole || undefined,
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterForm) => {
    clearError()
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        fleetName: data.fleetName,
        fleetAddress: data.fleetAddress,
      })
      router.push('/dashboard')
    } catch {
      // Error handled by store
    }
  }

  const selectRole = (role: 'fleet' | 'mechanic' | 'runner') => {
    setValue('role', role)
    setStep('details')
  }

  return (
    <div className="w-full max-w-lg">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center gap-2 mb-8">
        <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-brand-500">FleetSure</span>
      </Link>

      <Card>
        {step === 'role' ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Choose how you&apos;ll use FleetSure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => selectRole(role.id as 'fleet' | 'mechanic' | 'runner')}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                    selectedRole === role.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        role.color === 'blue' && 'bg-blue-100',
                        role.color === 'green' && 'bg-green-100',
                        role.color === 'purple' && 'bg-purple-100'
                      )}
                    >
                      <role.icon
                        className={cn(
                          'w-6 h-6',
                          role.color === 'blue' && 'text-blue-600',
                          role.color === 'green' && 'text-green-600',
                          role.color === 'purple' && 'text-purple-600'
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.title}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    {selectedRole === role.id && (
                      <CheckCircle className="w-5 h-5 text-brand-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <button
                onClick={() => setStep('role')}
                className="text-sm text-brand-500 hover:underline mb-2"
              >
                &larr; Change role
              </button>
              <CardTitle className="text-2xl">
                {roles.find((r) => r.id === selectedRole)?.title} Account
              </CardTitle>
              <CardDescription>
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      error={!!errors.firstName}
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      error={!!errors.lastName}
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    error={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    error={!!errors.phone}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                {selectedRole === 'fleet' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fleetName">Fleet/Company Name</Label>
                      <Input
                        id="fleetName"
                        placeholder="ABC Trucking Co."
                        error={!!errors.fleetName}
                        {...register('fleetName')}
                      />
                      {errors.fleetName && (
                        <p className="text-sm text-red-500">{errors.fleetName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fleetAddress">Business Address</Label>
                      <Input
                        id="fleetAddress"
                        placeholder="123 Main St, Seattle, WA"
                        {...register('fleetAddress')}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      error={!!errors.password}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    error={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-brand-500 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-brand-500 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </div>

                <Button type="submit" className="w-full" loading={isLoading}>
                  Create Account
                </Button>
              </form>
            </CardContent>
          </>
        )}
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

function RegisterLoading() {
  return (
    <div className="w-full max-w-lg">
      <Link href="/" className="flex items-center justify-center gap-2 mb-8">
        <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-brand-500">FleetSure</span>
      </Link>
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center p-4">
      <Suspense fallback={<RegisterLoading />}>
        <RegisterContent />
      </Suspense>
    </div>
  )
}
