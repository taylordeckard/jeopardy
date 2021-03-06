import nes from 'nes/client';
import { SOCKET_URL } from '../configs/config';

class Socket {
  constructor() {
    this.client = new nes.Client(SOCKET_URL);
  }
}

export default new Socket();
