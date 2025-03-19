interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

interface UpdateProfileRequestBody {
  name?: string;
  email?: string;
}
