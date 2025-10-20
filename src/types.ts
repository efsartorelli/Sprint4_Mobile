// src/types.ts
export type AccessEvent = {
  id: number;
  pessoa: string;
  status: 'Aprovado' | 'Negado' | string;
  primeira_vez: boolean | null;
  event_time: string;   // ISO
  created_at?: string;
};

export type NewAccessEvent = {
  pessoa: string;
  status: 'Aprovado' | 'Negado';
  primeira_vez: boolean;
  event_time?: string;  // opcional ao criar (default: agora)
};
