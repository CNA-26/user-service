import Roles from "../constants/roles";

router.put('/', async (req, res) => {
    const {userId, email} = req.body || {};
    const auth = req.auth; // ← ИЗ middleware

    if (auth.sub !== userId && auth.role !== Roles.ADMIN) {
        return res.status(401).json({
            error: 'Forbidden: insufficient permissions', code: 'FORBIDDEN',
        });
    }

    // validation
    if (!userId || !email) {
        return res.status(422).json({
            error: 'userId and email are required', code: 'VALIDATION_ERROR',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(422).json({
            error: 'Invalid email format', code: 'VALIDATION_ERROR',
        });
    }

    try {
        const user = await prisma.user.update({
            where: {id: userId}, data: {email},
        });

        return res.json({
            id: user.id, email: user.email, createdAt: user.createdAt,
        });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(400).json({
                error: 'User not found', code: 'USER_NOT_FOUND',
            });
        }

        if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
            return res.status(400).json({
                error: 'Email already exists', code: 'EMAIL_EXISTS',
            });
        }

        console.error('PUT /users error:', err);
        return res.status(500).json({
            error: 'Internal server error', code: 'INTERNAL_ERROR',
        });
    }
});