// 临时禁用middleware以解决编译问题
export const initializeMiddleware = () => {
  console.log('Middleware disabled temporarily')
}

export const destroyMiddleware = () => {
  console.log('Middleware cleanup disabled temporarily')
}

export const forceAutoSave = () => {
  console.log('Auto save disabled temporarily')
}

export const getNetworkStatus = () => {
  return true
}

export const clearBackup = () => {
  console.log('Backup clear disabled temporarily')
}