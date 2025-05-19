export type Group = {
  id: number;
  name: string;
  count: number;
};

export type ListResponse = {
  message: 'ok';
  data: {
    countOfRecords: number;
    items: Group[];
  };
};
