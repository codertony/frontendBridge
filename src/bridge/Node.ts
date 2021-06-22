import Bridge, {BridgeOptions, Event}  from './Bridge'
import { v4 as uuidv4 } from 'uuid'
declare module 'uuid'

enum NODEEVENT {
  init = '$nodeInit',
  transmit = '$transmit'
}
interface NEvent extends Event {
  path?: string
}

export default class Node {
  private _id: string = ''
  private _bridgeMap: {[x: string]: Bridge} = {}
  private _nodeMap: {[x: string]: string} = {}
  constructor({id, bridgeList}: {id: string, bridgeList: BridgeOptions[]}) {
    this._id = id;
    this.addBridge(bridgeList)
    this.on(NODEEVENT.init, (data, event) => {

    })
  }
  addBridge(bridgeList: BridgeOptions[]) {
    bridgeList.forEach(n => {
      let id = uuidv4();
      this._bridgeMap[id] = new Bridge(n)
      this._bridgeMap[id].send(NODEEVENT.init, {id: this._id})
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
  on(nodeId: string, event: string, fn: () => any): any
  on(event: string, fn: () => any): any
  on(a: string, b: any, c?: any): any {
    if(c) {

    } else {
      Object.keys(this._bridgeMap).forEach(key => {
        this._bridgeMap[key].on(a, (data: any, event: NEvent) => {
          let e = Object.assign({}, event, {
            path: event.path ? `${key}__${event.path}` : key
          })
          c(data, {event})
        })
      })
    }
  }
  off() {}
  once() {}
  handle() {}
  invoke() {}
}
