import { Request, Response, NextFunction } from 'express';
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import interfaceService from '../services/interface.service';
import { TimeRange } from '../services/types/interface.dto';

// class InterfaceController {
//     @ControllerErrorHandler()
//     async getInteractions(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const pageUrl = String(req.query.page_url);
//         const range = String(req.query.range || '7d')as TimeRange;

//         if (!webId || !pageUrl) {
//             return res.status(400).json({ error: 'Missing required parameters' });
//         }

//         const result = await interfaceService.getInteractions(webId, pageUrl, range);
//         return res.status(201).json(result);
//     }

//     @ControllerErrorHandler()
//     async getScrollData(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const pageUrl = String(req.query.page_url);
//         const range = String(req.query.range || '7d')as TimeRange;

//         if (!webId || !pageUrl) {
//             return res.status(400).json({ error: 'Missing required parameters' });
//         }

//         const result = await interfaceService.getScrollData(webId, pageUrl, range);
//         return res.json(result);
//     }

//     @ControllerErrorHandler()
//     async getElementStats(req: Request, res: Response, next: NextFunction): Promise<Response> {
//         const webId = Number(req.query.web_id);
//         const pageUrl = String(req.query.page_url);
//         const range = String(req.query.range || '7d')as TimeRange;

//         if (!webId || !pageUrl) {
//             return res.status(400).json({ error: 'Missing required parameters' });
//         }

//         const result = await interfaceService.getElementStats(webId, pageUrl, range);
//         return res.json(result);
//     }
// }








class InterfaceController {
    @ControllerErrorHandler()
    async getInteractions(req: Request, res: Response, next: NextFunction): Promise<Response> {
      const webId = Number(req.query.web_id);
      const pageUrl = String(req.query.page_url);
      const range = String(req.query.range || '7d') as '24h' | '7d' | '30d';
  
      const data = await interfaceService.getInteractions(webId, pageUrl, range);
      return res.json(data);
    }
  
    @ControllerErrorHandler()
    async getElementStats(req: Request, res: Response, next: NextFunction): Promise<Response> {
      const webId = Number(req.query.web_id);
      const pageUrl = String(req.query.page_url);
      const range = String(req.query.range || '7d') as '24h' | '7d' | '30d';
  
      const data = await interfaceService.getElementStats(webId, pageUrl, range);
      return res.json(data);
    }
  
    @ControllerErrorHandler()
    async getHeatmapData(req: Request, res: Response, next: NextFunction): Promise<Response> {
      const webId = Number(req.query.web_id);
      const pageUrl = String(req.query.page_url);
      const range = String(req.query.range || '7d') as '24h' | '7d' | '30d';
  
      const data = await interfaceService.getHeatmapData(webId, pageUrl, range);
      return res.json(data);
    }
  }





const interfaceController = new InterfaceController();
export default interfaceController;