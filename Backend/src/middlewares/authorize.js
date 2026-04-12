export const authorize = (requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.account?.permissions || [];
        const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
        if (!hasPermission) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        next();
    };
};
