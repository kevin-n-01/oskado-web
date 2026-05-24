import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY
})

const vercelReqToReq = (req: VercelRequest): Request => {
    const url = `https://${req.headers.host}${req.url}`;
    console.log(url);

    const method = req.method;
    const headers = new Headers(req.headers as Record<string, string>)

    const body = req.body ? JSON.stringify(req.body) : undefined;

    const request = new Request (url, {
        method, headers, body
    })

    return request;
}
export const requireAuth = async (vReq: VercelRequest, res: VercelResponse): Promise<boolean> => {
    try {
        const req = vercelReqToReq(vReq);

        console.log("Authenticating user...");

        const { isAuthenticated } = await clerkClient.authenticateRequest(req, {
            acceptsToken: 'session_token'
        })

        console.log("User Authenticated");

        if(!isAuthenticated) {
            res.status(401).json({error: "Unauthorized"});
            return !isAuthenticated;
        }

        return !isAuthenticated;
    } catch (e) {
        console.error(e instanceof Error ? e.message : "Error Authenticating User");
        res.status(401).json({error: "Unable to process authorization request."})
        return true;
    }
}
