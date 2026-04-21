export const authorize = (requiredPermissions, options = {}) => {
    return (req, res, next) => {
        const userPermissions = req.account?.permissions || [];
        const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
        
        // 1. If global permission is present, allow access
        if (hasPermission) {
            return next();
        }

        // 2. If allowSelf is enabled, check if the resource ownership matches
        if (options.allowSelf) {
            const userMaNV = req.account?.MaNV;
            const targetId = req.params.id;

            if (userMaNV && targetId && userMaNV === targetId) {
                return next();
            }
        }

        return res.status(403).json({ message: "Không có quyền truy cập" });
    };
};
