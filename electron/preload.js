import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('atomix', {
  version: '0.1.0',
  platform: process.platform,
})
