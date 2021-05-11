import Bridge, {BridgeOptions}  from './bridge'

export default class Center {
  private _id: string = ''
  private _bridgeMap = {}
  constructor({id}: {id: string}) {
    this._id = id
  }
  addBridge({bridgeList}: {bridgeList: BridgeOptions[]}) {
    bridgeList.forEach(n => {

    })
  }
}
