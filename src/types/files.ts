export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  tags: string[];
  url?: string;
}

export interface FileUploadResponse {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface FileListResponse {
  files: File[];
  total: number;
}
