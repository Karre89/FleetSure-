# Create Form

Create a form with validation for FleetSure.

## Instructions

When the user asks to create a form, follow these rules:

### Form Stack
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **@hookform/resolvers** - Connect zod to react-hook-form
- **shadcn/ui** - Form components

### Basic Form Structure

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// 1. Define schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof formSchema>

// 2. Create component
export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormValues) {
    // Handle submission
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  )
}
```

### Common Validation Patterns

```tsx
const jobRequestSchema = z.object({
  // Required string
  issueDescription: z.string().min(10, "Please describe the issue in detail"),

  // Select/enum
  issueType: z.enum(["engine", "electrical", "brakes", "tire", "transmission", "other"]),
  urgency: z.enum(["STANDARD", "PRIORITY", "EMERGENCY"]),

  // Optional
  vehicleId: z.string().optional(),
  notes: z.string().optional(),

  // Numbers
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),

  // Phone
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),

  // Money (as cents integer)
  amountCents: z.number().int().positive(),
})
```

### Form Field Types

**Text Input:**
```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Textarea:**
```tsx
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea rows={4} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Select:**
```tsx
<FormField
  control={form.control}
  name="urgency"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Urgency</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="STANDARD">Standard</SelectItem>
          <SelectItem value="PRIORITY">Priority</SelectItem>
          <SelectItem value="EMERGENCY">Emergency</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Form Submission with API

```tsx
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import { toast } from "sonner"

export function JobRequestForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => api.post("/jobs", values),
    onSuccess: () => {
      toast.success("Job created successfully")
      form.reset()
    },
    onError: (error) => {
      toast.error("Failed to create job")
    },
  })

  async function onSubmit(values: FormValues) {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* fields */}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Job"}
        </Button>
      </form>
    </Form>
  )
}
```

### Mobile Form Considerations

For Mechanic/Runner PWA forms:
- Large input fields (min height 44px)
- Big submit buttons
- Single column layout
- Auto-focus first field
- Use native date/time pickers on mobile
