export const MESSAGE = {
  login: 'Berhasil masuk!',
  register: 'Berhasil daftar dan masuk!',
  reset: 'Email reset password berhasil dikirim!',
  nameValidation: 'Nama minimal 3 karakter',
  roleValidation: 'Role minimal 3 karakter',
  emailValidation: 'Email tidak valid',
  passwordValidation: 'Password minimal 6 karakter',
  confirmPasswordValidation: 'Konfirmasi password harus minimal 6 karakter',
  passwordNotMatch: 'Password dan konfirmasi password tidak sama',
  terms: 'Kamu harus menyetujui kebijakan privasi',
}

export const FIREBASE_ERRORS_CODE: Record<string, string> = {
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/email-already-in-use': 'Email sudah digunakan.',
  'auth/network-request-failed': 'Jaringan bermasalah.',
  'auth/expired-action-code': 'Kode verifikasi sudah kadaluarsa.',
  'auth/user-not-found': 'User tidak ditemukan.',
  'auth/invalid-action-code': 'Kode verifikasi tidak valid.',
  'auth/user-disabled': 'User dinonaktifkan.',
  'auth/wrong-password': 'User atau Password yang anda masukkan salah.',
  default: 'Terjadi kesalahan saat signup/login',
}
