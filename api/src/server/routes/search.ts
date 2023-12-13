import express from 'express';
import ViewerService from '../../database/lib/viewers';

const router = express.Router();

router.get('/viewers', async (req, res, next) => {
  const partialName = req.query.name as string;
  if (!partialName) {
    res.sendStatus(400);
    return;
  }
  try {
    const viewers = await ViewerService.search(partialName);
    res.status(200).json(viewers.map((x) => x.displayName));
  } catch (e) {
    next(e);
  }
});

export default router;
