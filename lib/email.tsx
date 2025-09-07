// Simple email service without nodemailer for now
export async function sendVerificationEmail(email: string, username: string, token: string): Promise<void> {
  // For now, just log the verification email
  console.log(`Verification email for ${email} (${username}): Token ${token}`)

  // In production, you would integrate with a service like SendGrid, Resend, etc.
  // For now, we'll just simulate success
  return Promise.resolve()
}

// Simple email service without nodemailer for now
export async function sendPasswordResetEmail(email: string, username: string, token: string): Promise<void> {
  // For now, just log the password reset email
  console.log(`Password reset email for ${email} (${username}): Token ${token}`)

  // In production, you would integrate with a service like SendGrid, Resend, etc.
  // For now, we'll just simulate success
  return Promise.resolve()
}
