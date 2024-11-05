enum ErrorMessages {
  DefaultServer = 'The server encountered an error',
  ResourceNotFound = 'Resource not found',
  UserNotFound = 'User not found',
  IncorrectPassword = 'Incorrect password',
  BadRequest = 'Invalid request',
  EmailIsRegistered = 'Submitted email already registered',
  AccessForbidden = 'You do not have permission to access this resource',
  InvalidToken = 'Invalid or expired session. Please log in again',
}

export default ErrorMessages;
