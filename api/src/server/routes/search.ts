import express from 'express';
import { ViewerService } from 'utilities';

const router = express.Router();

router.get('/viewers', async (req, res, next) => {
  const partialName = req.query.name as string;
  if (!partialName) {
    res.sendStatus(400);
    return;
  }
  try {
    const viewers = await ViewerService.search(partialName);
    res.status(200).json(viewers);
  } catch (e) {
    next(e);
  }
});

router.get('/viewer/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const viewer = await ViewerService.get(id);
    if (!viewer) {
      res.sendStatus(400);
      return;
    }
    res.status(200).json(viewer);
  } catch (e) {
    next(e);
  }
});

export default router;
