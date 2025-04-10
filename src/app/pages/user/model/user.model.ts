export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password?: string;
  hiringDate?: Date;
  roles: Role[];
}

export interface Role {
  _id: string;
  name: string;
  description: string;
}
