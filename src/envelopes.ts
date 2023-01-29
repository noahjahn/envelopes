import Envelopes from './envelopes/index';

const envelopes: Envelopes = new Envelopes(process.env.ENVELOPES_API_BASE_URL);

export default envelopes;
