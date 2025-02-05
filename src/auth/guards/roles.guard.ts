import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { Request } from "express";
import { AuthenticatedUser } from "../authenticated-user.interface";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor (private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as AuthenticatedUser;

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Acesso negado! Você não tem permissão para executar essa ação.');
        }

        return true;
    }
}