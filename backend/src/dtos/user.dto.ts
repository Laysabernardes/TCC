export interface UserResponseType {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}