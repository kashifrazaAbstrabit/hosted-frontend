export interface SecureDataInterface {
  url: string;
  username: string;
  password: string;
  notes: string;
  isShared: boolean;
  itemName: string;
  projectId: number;
}

export interface SecureDataFileInterface {
  fileUrl: string | null;
  notes: string;
  isShared: boolean;
  itemName: string;
  projectId: number;
}
