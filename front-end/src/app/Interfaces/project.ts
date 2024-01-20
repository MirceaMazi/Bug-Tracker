import { User } from './user';
import { Bug } from './bug';

export interface ProjectPost {
  id?: number;
  name: string;
  repository: string;
  description?: string;
  members: string[];
  bugs?: Bug[];
}

export interface ProjectGet {
  id?: number;
  name: string;
  repository: string;
  description?: string;
  users: string[];
  bugs?: Bug[];
}
