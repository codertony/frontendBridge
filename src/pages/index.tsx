import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import Bridge from '@/bridge/bridge';


export default function IndexPage() {
  const [test, setTest] = useState(0)
  let iframeRef = useRef(null)
  const br = useMemo(() => {
    return new Bridge({
      onMessage(fn: (mes: string) => void): void {
        window.addEventListener("message", (message) => {
          console.log(message)
          fn(message.data)
        }, false)
      }, send: message => {
        iframeRef.current?.contentWindow.postMessage(message, '*')
      }})
  }, [iframeRef.current])
  useEffect(() => {
    br.handle('ptest', () => 7777)
  }, [iframeRef.current])
  const testClick = useCallback(() => {
    br?.invoke('test', {
      aaa: '2222'
    }).then(data => console.log(data))
  }, [])
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <button onClick={testClick}>测试</button>
      <iframe src='//localhost:8000/c1' ref={iframeRef}></iframe>
    </div>
  );
}
