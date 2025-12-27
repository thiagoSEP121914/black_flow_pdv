import { Router, Request, Response } from "express";
import { Controller } from "../../core/Controller.js";
import { storeService, CreateStoreDTO, UpdateStoreDTO } from "./StoreService.js";
import { AccessTokenPayload } from "../../middlewares/authToken.js";

export interface AuthenticateRequest extends Request {
    user: AccessTokenPayload;
}

export class StoreController extends Controller {
    handle(): Router {
        this.route.post("/", async (req: Request, res: Response) => {
            try {
                // ✅ Correção: Use 'Request' na assinatura e faça o cast aqui
                const companyId = (req as AuthenticateRequest).user.companyId;
                const data = req.body as CreateStoreDTO;
                const store = await storeService.createStore(companyId, data);
                return res.status(201).json(store);
            } catch (err) {
                const error = err as Error;
                console.error(error);
                return res.status(error.message.includes("not found") ? 404 : 500).json({ error: error.message });
            }
        });

        this.route.get("/", async (req: Request, res: Response) => {
            try {
                // ✅ Correção: Use 'Request' na assinatura e faça o cast aqui
                const companyId = (req as AuthenticateRequest).user.companyId;
                const page = parseInt(req.query.page as string) || 1;
                const perPage = parseInt(req.query.perPage as string) || 10;
                const result = await storeService.getStores(companyId, page, perPage);
                return res.json(result);
            } catch (err) {
                const error = err as Error;
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });

        this.route.get("/:id", async (req: Request, res: Response) => {
            try {
                const companyId = (req as AuthenticateRequest).user.companyId;
                const storeId = req.params.id;
                const store = await storeService.getStoreById(companyId, storeId);
                if (!store) return res.status(404).json({ error: "Store not found" });
                return res.json(store);
            } catch (err) {
                const error = err as Error;
                console.error(error);
                return res.status(error.message.includes("not found") ? 404 : 500).json({ error: error.message });
            }
        });

        this.route.put("/:id", async (req: Request, res: Response) => {
            try {
                const companyId = (req as AuthenticateRequest).user.companyId;
                const storeId = req.params.id;
                const data = req.body as UpdateStoreDTO;
                const store = await storeService.updateStore(companyId, storeId, data);
                if (!store) return res.status(404).json({ error: "Store not found for update" });
                return res.json(store);
            } catch (err) {
                const error = err as Error;
                console.error(error);
                return res.status(error.message.includes("not found") ? 404 : 400).json({ error: error.message });
            }
        });

        this.route.delete("/:id", async (req: Request, res: Response) => {
            try {
                // ✅ Correção: Use 'Request' na assinatura e faça o cast aqui
                const companyId = (req as AuthenticateRequest).user.companyId;
                const storeId = req.params.id;
                const result = await storeService.deleteStore(companyId, storeId);
                if (!result) return res.status(404).json({ error: "Store not found for deletion" });
                return res.status(204).send();
            } catch (err) {
                const error = err as Error;
                console.error(error);
                return res.status(error.message.includes("not found") ? 404 : 400).json({ error: error.message });
            }
        });

        return this.route;
    }
}

export const storeController = new StoreController().handle();
