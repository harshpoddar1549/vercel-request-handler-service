import { Router } from "express";
import { GlobalController } from "../controllers/global.controller";

export const globalRouter = Router()

globalRouter.get('*', GlobalController.handleAllRequest)
