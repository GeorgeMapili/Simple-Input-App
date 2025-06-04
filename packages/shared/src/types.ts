export interface InputItem {
  id: number;
  text: string;
  createdAt: string | Date;
}

export interface CreateInputRequest {
  text: string;
}
