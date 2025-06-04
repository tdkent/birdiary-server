export type ListResponse = {
  message: 'ok';
  data: {
    countOfRecords: number;
    items: any[];
  };
};

export type GroupedData = {
  id: number;
  text: string;
  count: number;
};
