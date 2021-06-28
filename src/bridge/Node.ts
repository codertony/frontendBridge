import Bridge, {BridgeOptions, Event}  from './Bridge'
import { v4 as uuidv4 } from 'uuid'
declare module 'uuid'

enum NODEEVENT {
  init = '$nodeInit',
  initBack = '$nodeInitBack',
  transmit = '$transmit'
}
interface NEvent extends Event {
  path?: string
}

export default class Node {
  private _id: string = ''
  private _bridgeMap: {[x: string]: Bridge} = {}
  private _nodeMap: {[x: string]: string} = {}
  private delEvent(event: NEvent, bridegKey: string) {
    return Object.assign({}, event, {
      path: event.path ? `${bridegKey}__${event.path}` : bridegKey
    })
  }
  constructor({id, bridgeList}: {id: string, bridgeList: BridgeOptions[]}) {
    this._id = id;
    this.addBridge(bridgeList)
    this.handle(NODEEVENT.initBack, (data, event) => {
      if(data.id !=== this._id) {

      }
    })
    this.on(NODEEVENT.init, (data, event) => {
      console.log(NODEEVENT.init, data, event)
      if(event.path) {
        let pathList = event.path.split('__');
        let bId = pathList.pop() || '';
        this._bridgeMap[bId].invoke(NODEEVENT.initBack, {id, path: pathList.join('__')})
      }
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
  on(nodeId: string, cannel: string, fn: (data: any, event: NEvent) => any): any
  on(cannel: string, fn: (data: any, event: NEvent) => any): any
  on(a: string, b: any, c?: any): any {
    if(c) {

    } else {
      Object.keys(this._bridgeMap).forEach(key => {
        this._bridgeMap[key].on(a, (data: any, event: NEvent) => {
          c(data, {...this.delEvent(event, key)})
        })
      })
    }
  }
  off() {}
  once() {}
  on(nodeId: string, cannel: string, fn: () => any): any
  on(cannel: string, fn: () => any): any
  handle(a: string, b: any, c?: any): any {
    if(c) {

    } else {
      Object.keys(this._bridgeMap).forEach(key => {
        this._bridgeMap[key].handle(a, (data: any, event: NEvent) => {
          let e = Object.assign({}, event, {
            path: event.path ? `${key}__${event.path}` : key
          })
          return c(data, {...this.delEvent(event, key)})
        })
      })
    }
  }
  invoke() {}
}
