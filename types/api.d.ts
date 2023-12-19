//type ViewerDoc = import('../utilities/database/lib/viewers/viewer_model').ViewerDoc;

interface ViewerDoc {
  twitchId: string;
  login: string;
  displayName: string;
  names: { login: string; displayName: string }[];
}
