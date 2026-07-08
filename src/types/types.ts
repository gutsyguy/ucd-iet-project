export interface AggieFeedResponse {
  _id: String;
  generator: {
    id: String;
  };
  actor: {
    author: {
      displayName: String;
      id: String;
    };
    displayName: String;
    id: String;
    objectType: String;
  };
  icon: String;
  object: {
    content: String;
    ucdEdusModel: {
      url: String;
      urlDisplayName: String;
    };
    ucdSrcId: String;
    objectType: String;
    id: String;
    hash: String;
    masterId: String;
  };
  title: String;
  ucdEdusMeta: {
    endDate: String;
    labels: String[];
    startDate: String;
  };
  verb: String;
  id: String;
  priority: Number;
  published: String;
}
