import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class StompService {

  socket = new SockJS('http://localhost:8080/websocket');
  stompClient = Stomp.over(this.socket);

  init(): void {
    const connected: boolean = this.stompClient.connected;
  }

  subscribe(topic: string[], subscriptionCallback: any, onConnectedCallback: any): void {
    const connected: boolean = this.stompClient.connected;
    if(connected) {
      for(let i=0; i<topic.length; i++) {
        this.subscribeToTopic(topic[i], subscriptionCallback);
      }
      return;
    }

    //if stomp client is not connected
    console.warn("CONNECTING =================")
    this.stompClient.connect({}, (): any => {
      onConnectedCallback();

      for(let i=0; i<topic.length; i++) {
        this.subscribeToTopic(topic[i], subscriptionCallback);
      }
    })
  }

  private subscribeToTopic(topic: string, callback: any): void {
    this.stompClient.subscribe(topic, (message: any) => {
      callback(message.body);
    });
  }

}
