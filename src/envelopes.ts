import Envelopes from './envelopes/index';

if (
  process.env.ENVELOPES_API_BASE_URL === '' ||
  process.env.ENVELOPES_API_BASE_URL === null ||
  process.env.ENVELOPES_API_BASE_URL === undefined
) {
  throw new Error(
    'The ENVELOPES_API_BASE_URL environment variable is required to be set',
  );
}
const envelopes: Envelopes = new Envelopes(process.env.ENVELOPES_API_BASE_URL);

export default envelopes;
