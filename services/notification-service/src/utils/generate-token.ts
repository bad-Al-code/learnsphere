import jwt from 'jsonwebtoken';
import { env } from '../config/env';
const payload = {
  id: '85290aac-9d5b-40c1-870d-e69f12c681e1',
};

console.log(jwt.sign(payload, env.JWT_SECRET, { expiresIn: '2h' }));
