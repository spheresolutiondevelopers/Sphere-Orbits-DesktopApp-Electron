export interface WebSocketMessage {
  type: string;
  payload: any;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000;
  private messageHandler: ((data: any) => void) | null = null;
  private subscriptions: Set<string> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  setAuthToken(token: string): void {
    this.token = token;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: 'auth', payload: { token } });
    }
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = this.token
      ? `${this.url}?token=${encodeURIComponent(this.token)}`
      : this.url;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      // Re-subscribe to all active subscriptions
      for (const convId of this.subscriptions) {
        this.send({ type: 'subscribe', payload: { conversationID: convId } });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.messageHandler) {
          this.messageHandler(data);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  onMessage(handler: (data: any) => void): void {
    this.messageHandler = handler;
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not open. Message queued for next connection.');
      // Queue message for when connection is restored
      this.queueMessage(message);
    }
  }

  subscribe(conversationID: string): void {
    this.subscriptions.add(conversationID);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: 'subscribe', payload: { conversationID } });
    }
  }

  unsubscribe(conversationID: string): void {
    this.subscriptions.delete(conversationID);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: 'unsubscribe', payload: { conversationID } });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max reconnect attempts reached');
      return;
    }
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => this.connect(), delay);
  }

  private queue: WebSocketMessage[] = [];

  private queueMessage(message: WebSocketMessage): void {
    this.queue.push(message);
    // Try to send queued messages when connection is re-established
    const interval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.queue.length > 0) {
        const msg = this.queue.shift();
        if (msg) {
          this.send(msg);
        }
      }
      if (this.queue.length === 0) {
        clearInterval(interval);
      }
    }, 500);
  }
}