export interface CommentParams {
  sectionId: string;
}

export interface Comment {
  id: string;
  content: string;
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
}
