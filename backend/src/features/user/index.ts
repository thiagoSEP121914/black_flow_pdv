import { prisma } from "../../core/prisma.js";
import { UserRepositoryImpl } from "./repositories/UserRepositoryImpl.js";
import { UserService } from "./UserService.js";
import { UserController } from "./UserController.js";

const userRepositoryImpl = new UserRepositoryImpl(prisma);
const userService = new UserService(userRepositoryImpl);
const userController = new UserController(userService);

export { userService, userController };
