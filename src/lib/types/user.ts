export interface UserRole {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'superadmin' | 'admin' | 'user';
  dni?: string;
  celular?: string;
  adminDni?: string;
  nombre?: string;
  apellido?: string;
  forcePasswordChange?: boolean;
}

export interface AuthState {
  user: any | null; // Firebase User
  dbUser: UserData | null; // Datos de MySQL
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}
