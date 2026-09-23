/** Acceso defensivo: navegadores y WebViews pueden bloquear localStorage. */
export function readStorage(key,provider=()=>globalThis.localStorage){
  try{return provider()?.getItem(key)??null;}catch{return null;}
}

export function writeStorage(key,value,provider=()=>globalThis.localStorage){
  try{provider()?.setItem(key,value);return true;}catch{return false;}
}
