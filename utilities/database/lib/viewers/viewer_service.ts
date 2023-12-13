import ViewerModel from './viewer_model';
import _ from 'lodash';

async function store(messages: ElasticTmi[]) {
  const items = _.uniqBy(messages, 'login').map((x) => {
    return {
      updateOne: {
        filter: { twitchId: x.user_id },
        update: {
          $set: { login: x.login, displayName: x.display_name },
          $addToSet: { names: { login: x.login, displayName: x.display_name } },
        },
        upsert: true,
      },
    };
  });

  // @ts-expect-error $addToSet
  return ViewerModel.collection.bulkWrite(items);
}

export default {
  store,
};
