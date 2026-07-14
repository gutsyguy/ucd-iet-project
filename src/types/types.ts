export interface AggieFeedResponse {
  _id: string;
  generator: {
    id: string;
  };
  actor: {
    author: {
      displayName: string;
      id: string;
    };
    displayName: string;
    id: string;
    objectType: string;
  };
  icon: string;
  object: {
    content: string;
    ucdEdusModel: {
      url: string;
      urlDisplayName: string;
    };
    ucdSrcId: string;
    objectType: string;
    id: string;
    hash: string;
    masterId: string;
  };
  title: string;
  ucdEdusMeta: {
    endDate: string;
    labels: string[];
    startDate: string;
  };
  verb: string;
  id: string;
  priority: number;
  published: string;
}