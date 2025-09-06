import Chance from 'chance'

export const getIp = () => new Chance().ip()
