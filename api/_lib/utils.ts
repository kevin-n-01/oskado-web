import type {VercelResponse} from '@vercel/node'

export function handleServerError(error: unknown, res: VercelResponse) {
  const renderError = error instanceof Error ? error.message : `Unknown Error: ${error}`;
  console.error(renderError);
  return res.status(500).json({error: renderError});
}
