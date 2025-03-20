import 'jsonwebtoken'; // Import the original module

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: number; // Add your custom property
  }
}
