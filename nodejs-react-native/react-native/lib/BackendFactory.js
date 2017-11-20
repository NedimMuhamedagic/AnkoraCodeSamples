import { Backend } from './Backend.js'

export default function BackendFactory( token = null ) {
  Backend.initialize( token )
  return Backend
}
