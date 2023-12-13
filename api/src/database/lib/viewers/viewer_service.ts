import ViewerModel, { ViewerDoc } from './viewer_model';

async function search(partialName: string): Promise<ViewerDoc[]> {
  return ViewerModel.find({ login: { $regex: partialName, $options: 'i' } });
}

export default {
  search,
};
