import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/lib/db";
import humps from 'humps';
import { handleServerError } from "../server-utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const result = await sql`SELECT * FROM measurements`;
            return res.status(200).json(humps.camelizeKeys(result))
        } catch(e) {
            handleServerError(e, res);
        }

    } else if (req.method === 'POST') {
        try {
            const measurementName = req.body.measurementName;
            if(!measurementName) return res.status(400).json({error: "Measurement Name is Required"});
            const result = await sql`INSERT INTO measurements (measurement_name) VALUES (${measurementName}) RETURNING *`;
            return res.status(201).json(humps.camelizeKeys(result));
        } catch (e) {
            handleServerError(e, res);
        }

    }
}