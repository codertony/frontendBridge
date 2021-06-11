import Bridge, {BridgeOptions}  from './Bridge'
import { v4 as uuidv4 } from 'uuid'
declare module 'uuid'

enum nodeEvent {
  init = '$nodeInit',
  transmit = '$transmit'
}

export default class Node {
  private _id: string = ''
  private _bridgeMap: {[x: string]: Bridge} = {}
  private _nodeMap: {[x: string]: string} = {}
  constructor({id, bridgeList}: {id: string, bridgeList: BridgeOptions[]}) {
    this._id = id;
    this.addBridge(bridgeList)
  }
  addBridge(bridgeList: BridgeOptions[]) {
    bridgeList.forEach(n => {
      let id = uuidv4();
      this._bridgeMap[id] = new Bridge(n)
      this._bridgeMap[id].send(nodeEvent.init, {id: this._id})
    })
  }
  private transmit() {

  }
  getNodes() {
    return Object.keys(this._nodeMap)
  }
  checkNodes() {}
  send(nodeId: string, event: string, data: any): any
  send(event: string, data: any): any
  send(a: string, b: any, c?: any): any {
    if(c === undefined) {
      Object.values(this._bridgeMap).forEach(n => {
        n.send(a, {to: '', data: b, from: this._id})
      })
    }
  }
  on() {}
  off() {}
  once() {}
  handle() {}
  invoke() {}
}
