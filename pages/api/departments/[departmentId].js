import prisma from '../../../lib/prisma';
import roles from '../../../lib/roles';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status = 401;
        res.end('Unauthorized access');
        return;
    }

    if (req.method === 'GET') {
        if (!session.roles.includes(roles.USER_TYPE_DEPARTMENT)) {
            res.statusCode = 403;
            return res.end('You do not have permission to view individual departments');
        }

        const includes = {};

        if (session.roles.includes(roles.USER_TYPE_DEPARTMENT)) {
            includes.clinician_join_codes = { select: { code: true } };
        }

        const department = await prisma.departments.findMany({
            where: { id: +req.query.departmentId },
            include: includes,
        });

        return res.json(department);
    }

    res.statusCode = 405;
    res.end('HTTP Method Not Allowed');
}
