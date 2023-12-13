import ViewerModel from './viewer_model';

async function store(messages: { channel: string; message: ElasticTmi }[]) {
  const items = messages.map((x) => {
    return {
      updateOne: {
        filter: { twitchId: x.message.user_id },
        update: {
          $set: { login: x.message.login, displayName: x.message.display_name },
          $addToSet: { names: { login: x.message.login, displayName: x.message.display_name } },
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