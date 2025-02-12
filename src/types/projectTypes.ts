export interface Projects {
  id: number;
  name: string;
  status?: string;
  [key: string]: any; // To handle additional properties if needed
}

export interface Project {
  name: string;
  description: string;
  start_date: string;
  status: string;
  assigned_people: { developer_id: number }[];
}

export interface Documents {}
export interface SecureStores {
  id(id: any): unknown;
}
export interface SecureFileStores {
  id(id: any): unknown;
}
export interface ProjectKnowleges {}
export interface ProjectKnowlege {
  uploadUrl: string;

  [key: string]: any; // To handle additional properties if needed
}
export interface SecureFileStore {}

export interface SecrueDetail {}
export interface SecureFileDetail {}
