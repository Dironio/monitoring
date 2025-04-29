import { Request, Response, NextFunction } from 'express';
import ControllerErrorHandler from "./tools/controllerErrorHandler";
import interfaceService from '../services/interface.service';
import { TimeRange } from '../services/types/interface.dto';

class InterfaceController {
  // @ControllerErrorHandler()
  // async getInteractions(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const webId = Number(req.query.web_id);
  //   const pageUrl = String(req.query.page_url);
  //   const range = String(req.query.range || '7d') as '24h' | '7d' | '30d';

  //   const data = await interfaceService.getInteractions(webId, pageUrl, range);
  //   return res.json(data);
  // }

  // @ControllerErrorHandler()
  // async getElementStats(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const webId = Number(req.query.web_id);
  //   const pageUrl = String(req.query.page_url);
  //   const range = String(req.query.range || '7d') as '24h' | '7d' | '30d';

  //   const data = await interfaceService.getElementStats(webId, pageUrl, range);
  //   return res.json(data);
  // }

  // @ControllerErrorHandler()
  // async getHeatmapData(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const webId = Number(req.query.web_id);
  //   const pageUrl = String(req.query.page_url);
  //   const range = String(req.query.range || '7d') as '24h' | '7d' | '30d';

  //   const data = await interfaceService.getHeatmapData(webId, pageUrl, range);
  //   return res.json(data);
  // }





  @ControllerErrorHandler()
  async getInteractions(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const webId = Number(req.query.web_id);
    const pageUrl = String(req.query.page_url);
    const range = String(req.query.range || '7d') as TimeRange;
    const data = await interfaceService.getInteractions(webId, pageUrl, range);
    return res.json(data);
  }

  @ControllerErrorHandler()
  async getElementStats(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const webId = Number(req.query.web_id);
    const pageUrl = String(req.query.page_url);
    const range = String(req.query.range || '7d') as TimeRange;
    const withDetails = req.query.details === 'true';
    const data = await interfaceService.getElementStats(webId, pageUrl, range, withDetails);
    return res.json(data);
  }

  @ControllerErrorHandler()
  async getHeatmapData(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const webId = Number(req.query.web_id);
    const pageUrl = String(req.query.page_url);
    const range = String(req.query.range || '7d') as TimeRange;
    const withDetails = req.query.details === 'true';
    const data = await interfaceService.getHeatmapData(webId, pageUrl, range, withDetails);
    return res.json(data);
  }

  @ControllerErrorHandler()
  async getElementDetails(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const webId = Number(req.query.web_id);
    const pageUrl = String(req.query.page_url);
    const range = String(req.query.range || '7d') as TimeRange;
    const elementType = String(req.query.element_type);
    const data = await interfaceService.getElementDetails(webId, pageUrl, range, elementType);
    return res.json(data);
  }

  @ControllerErrorHandler()
  async getClickDetails(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const webId = Number(req.query.web_id);
    const pageUrl = String(req.query.page_url);
    const range = String(req.query.range || '7d') as TimeRange;
    const x = Number(req.query.x);
    const y = Number(req.query.y);
    const data = await interfaceService.getClickDetails(webId, pageUrl, range, x, y);
    return res.json(data);
  }

}





const interfaceController = new InterfaceController();
export default interfaceController;