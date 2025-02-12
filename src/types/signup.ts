export interface UserRegister {
  isAgreeToTermsAndPrivacy: boolean | undefined;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
}

export interface UserRegisterForDataBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
}

export interface UpdateUserBody {
  first_name: string;
  last_name: string;
  job_title: string;
  department: string;
  role: string;
  email: string;
  username: string;
  bio: string;
}

export interface DataBody extends UserRegisterForDataBody {
  user_type: string;
  auth_type: string;
  invitationToken?: string;
}

export interface SignUpBody {
  selectedRole: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  user_type: string;
  auth_type: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
