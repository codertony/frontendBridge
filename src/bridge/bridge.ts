//@ts-ignore
import * as EventEmitter from 'events'

export interface BridgeOptions {
	send: (mes: string) => void
	onMessage: (fn: (mes: string) => void) => void
}
interface Event {
	channel: string
	// 消息id,组成：${pid}-${消息数目id}
	messageId: string
	data: any
}
export type IHandle = (data: any, event: Event) => void

export default class Bridge {
	private eventEmit = new EventEmitter()
	private pid = process.pid
	private AutoIncreaseId = 0
	private _send: BridgeOptions['send']
  private _global = {}
	constructor({ send, onMessage }: BridgeOptions) {
		this._send = send
		onMessage(this.messageHandle.bind(this))
	}
	send(channel: string, data?: any, messageId?: string) {
		let obj = this.genMessageData(channel, data, messageId)
		this._send(JSON.stringify(obj))
		return obj
	}
	on(channel: string, fn: IHandle) {
		this.eventEmit.on(channel, fn)
	}
	off(channel: string, fn: IHandle) {
		this.eventEmit.off(channel, fn)
	}
	once(channel: string, fn: IHandle) {
		this.eventEmit.once(channel, fn)
	}
	invoke(channel: string, data: any) {
		return new Promise((resolve, reject) => {
			let obj = this.send(channel, data)
			const { messageId } = obj
			this.once(`${channel}_${messageId}`, (data, evnet) => {
				if(data.err) {
					reject(data.err)
				} else {
					resolve(data.data)
				}
			})
		})
	}
	handle(channel: string, fn: (...args: any[]) => any) {
		let self = this
		function handleFn(data: any, event: Event) {
			let result: any
			try {
				result = fn(data, event)
				Promise.resolve(result).then((res) => {
					self.send(`${channel}_${event.messageId}`, {data: res})
				}).catch(err => {
					self.send(`${channel}_${event.messageId}`, {err})
				})
			} catch (err) {
				self.send(`${channel}_${event.messageId}`, {err: err.message})
			}
		}
		this.eventEmit.removeAllListeners(channel)
		this.on(channel, handleFn)
	}
	setGlobal(key: string, data: any) {
    this._global[key] = data
  }
  remoteGetGlobal(bridgeId, key) {
	  return new Proxy({}, {
	    get() {

      }
    })
  }
	private genMessageData(channel: string, data: any, messageId?: string) {
		messageId = messageId || `${this.pid}-${this.AutoIncreaseId}`
		this.AutoIncreaseId++;
		let obj: Event = {
			channel: channel,
			messageId,
			data
		}
		return obj
	}
	private messageHandle(message: string) {
		let obj: Event
		try {
			obj = JSON.parse(message)
		} catch (err) {
			throw new Error(`JSON parser Error:${message}`)
		}
		const { channel, data, messageId } = obj
		if(this.eventEmit.eventNames().includes(channel)) {
			this.eventEmit.emit(channel, data, obj)
		} else {
			this.send(`${channel}_${messageId}`, {err:`通信进程不存在handle事件：${channel}`})
		}

	}
}
