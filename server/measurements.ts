import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/lib/db";
import humps from 'humps';
import { handleServerError } from "../server-utils";

export async function measurementsHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const result = await sql`SELECT * FROM measurements`;
            return res.status(200).json(humps.camelizeKeys(result));
        } catch (error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'POST') {
        try {
            const measurementName = req.body.measurementName;
            if (!measurementName) return res.status(400).json({ error: "Measurement Name is Required" });
            const result = await sql`INSERT INTO measurements (measurement_name) VALUES (${measurementName}) RETURNING *`;
            return res.status(201).json(humps.camelizeKeys(result));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
