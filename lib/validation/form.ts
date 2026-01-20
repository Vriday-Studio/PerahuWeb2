import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1, 'Please enter your password'),
})

export type TLoginFormSchema = z.infer<typeof loginFormSchema>

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(30, 'Name is too long')
      .refine((data) => data.trim(), {
        message: 'Name must not have leading or trailing whitespace',
      }),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data?.password === data?.confirmPassword, {
    message: 'Confirm password not match',
    path: ['confirmPassword'],
  })

export type TRegisterFormSchema = z.infer<typeof registerFormSchema>

export const forgotPasswordFormSchema = z.object({
  email: z.string().email().min(1),
})

const currentYear = new Date().getFullYear()

export const createProfileFormSchema = z.object({
  // name: z.string().min(1, 'Please input a name'),
  // gender: z
  //   .enum(['male', 'female'])
  //   .nullable()
  //   .refine((value) => value !== null && value !== undefined, {
  //     message: 'Please select a gender',
  //   }),
  // day: z.string().refine(
  //   (value) => {
  //     const intValue = parseInt(value, 10)
  //     return intValue >= 1 && intValue <= 31
  //   },
  //   {
  //     message: 'Please enter a valid day (01 to 31)',
  //   }
  // ),
  // month: z.string().refine(
  //   (value) => {
  //     const intValue = parseInt(value, 10)
  //     return intValue >= 1 && intValue <= 12
  //   },
  //   {
  //     message: 'Please enter a valid month (01 to 12)',
  //   }
  // ),
  // year: z.string().refine(
  //   (value) => {
  //     const intValue = parseInt(value, 10)
  //     return intValue >= 1900 && intValue <= currentYear
  //   },
  //   {
  //     message: `Please enter a valid year (1900 to ${currentYear})`,
  //   }
  // ),
  // phone_number: z.string().refine(
  //   (value) => {
  //     // Remove non-numeric characters from the phone number
  //     const numericValue = value.replace(/\D/g, '')
  //     // Validate the length and format of the phone number
  //     return /^(\+?\d{1,4}[\s-]?)?\d{10}$/.test(numericValue)
  //   },
  //   {
  //     message: 'Invalid phone number',
  //   }
  // ),
  name: z.unknown(),
  gender: z.unknown(),
  day: z.unknown(),
  month: z.unknown(),
  year: z.unknown(),
  phone_number: z.unknown(),
})

export type TCreateProfileFormSchema = z.infer<typeof createProfileFormSchema>
